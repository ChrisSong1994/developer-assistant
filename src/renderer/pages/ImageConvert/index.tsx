import { ClearOutlined, CompressOutlined, RedoOutlined, StopOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, ConfigProvider, InputNumber, Select, Space, Table, Tooltip } from 'antd';
import { useEffect, useMemo, useRef, useState } from 'react';

import Empty from '@/renderer/components/Empty';
import Icon from '@/renderer/components/Icon';
import { useLocalData, useWindowSize } from '@/renderer/hooks';
import { arrayObjDeWightByKey, formatFileSize } from '@/renderer/utils';
import Events from '@/renderer/utils/events';
// 注意:只能 type 导入,main/modules/imageConvert 依赖 worker_threads/electron/sharp,
// 若运行时导入会把主进程模块打进 web bundle 导致 "Can't resolve 'worker_threads'"
import type { EImageStatus, IImageConvertInfo } from '../../../main/modules/imageConvert';

import styles from './index.module.less';

const IMAGES_DATA_KEY = 'originalFilePath';
const IMAGES_CONVERT_KEY = 'images_convert';
const TABLE_HEIGHT_PADDING = 110;

const TARGET_FORMAT_OPTIONS = [
  { label: 'jpeg', value: 'jpeg' },
  { label: 'png', value: 'png' },
  { label: 'webp', value: 'webp' },
  { label: 'avif', value: 'avif' },
  { label: 'gif', value: 'gif' },
];

const STATUS_TEXT_MAP: Record<string, string> = {
  pending: '待处理',
  success: '已完成',
  failure: '失败',
};

const ImageConvert = () => {
  const { data: localData, setData: setLocalData } = useLocalData();
  const images = localData?.[IMAGES_CONVERT_KEY] || [];
  const [convertLoading, setConvertLoading] = useState<boolean>(false);
  // 全局默认参数
  const [defaultTargetFormat, setDefaultTargetFormat] = useState<string>('webp');
  const [defaultQuality, setDefaultQuality] = useState<number | null>(80);
  const [defaultWidth, setDefaultWidth] = useState<number | null>(null);
  // 正在单张转换的文件路径,用于行内 loading 与按钮禁用
  const [convertingPaths, setConvertingPaths] = useState<string[]>([]);
  const { height } = useWindowSize();
  // 最新 images 快照:异步回调 resolve 时读取,避免闭包陈旧导致丢行/回填已删行
  const imagesRef = useRef<IImageConvertInfo[]>(images);
  imagesRef.current = images;
  const tableHeight = useMemo(() => height - TABLE_HEIGHT_PADDING, [height]); // 表格高度

  // 转换中逐张进度:镜像到 state 供表格实时渲染,同时存 ref 供异常/取消时合并
  const [progress, setProgress] = useState<Record<string, IImageConvertInfo>>({});
  const progressRef = useRef<Record<string, IImageConvertInfo>>({});
  const applyProgress = (img: IImageConvertInfo) => {
    progressRef.current[img.originalFilePath] = img;
    setProgress({ ...progressRef.current });
  };
  const clearProgress = () => {
    progressRef.current = {};
    setProgress({});
  };
  // 表格数据源:未完成的用原始行,已完成的用进度行(基于 originalFilePath 对应 rowKey,稳定)
  const displayImages = useMemo(
    () => images.map((img: IImageConvertInfo) => progress[img.originalFilePath] ?? img),
    [images, progress],
  );

  useEffect(() => {
    const unsubscribe = window.electronBridge?.on('imageConvert:item', (img) => applyProgress(img));
    return () => {
      unsubscribe?.();
    };
  }, []);

  const handleUploadImages = async () => {
    const result = await Events.uploadConvertImages({
      filters: [{ name: '图片选择', extensions: ['*.png', '*.jpg', '*.jpeg', '*.webp', '*.avif', '*.gif'] }],
    });
    if (result) {
      const newImages = arrayObjDeWightByKey([...images, ...result], IMAGES_DATA_KEY); // 基于 originalFilePath 去重
      setLocalData({ [IMAGES_CONVERT_KEY]: newImages });
    }
  };

  const handleConvert = async () => {
    setConvertLoading(true);
    clearProgress();
    try {
      const result = await Events.imageConvert({
        data: images,
        targetFormat: defaultTargetFormat,
        quality: defaultQuality ?? 80,
        width: defaultWidth ?? undefined,
      });
      // @ts-ignore
      if (result) setLocalData({ [IMAGES_CONVERT_KEY]: result });
    } catch (error) {
      // 取消或异常:保留已完成的逐张结果,一次持久化
      const keepImages = images.map((img: IImageConvertInfo) => progressRef.current[img.originalFilePath] ?? img);
      setLocalData({ [IMAGES_CONVERT_KEY]: keepImages });
    } finally {
      clearProgress();
      setConvertLoading(false);
    }
  };

  const handleCancel = async () => {
    await Events.cancelImageConvert();
  };

  const handleShowItem = async (filePath: string) => {
    await Events.showItemInFolder({ path: filePath });
  };

  const handleClearImage = (originalFilePath: string) => {
    setLocalData({
      [IMAGES_CONVERT_KEY]: images.filter((v: IImageConvertInfo) => v.originalFilePath !== originalFilePath),
    });
  };

  // 单行目标格式:仅更新该行
  const handleChangeTargetFormat = (originalFilePath: string, targetFormat: string) => {
    setLocalData({
      [IMAGES_CONVERT_KEY]: images.map((img: IImageConvertInfo) =>
        img.originalFilePath === originalFilePath ? { ...img, targetFormat } : img,
      ),
    });
  };

  // 单行质量:仅更新该行,未设置时在转换时走全局默认质量
  const handleChangeQuality = (originalFilePath: string, quality: number | null) => {
    setLocalData({
      [IMAGES_CONVERT_KEY]: images.map((img: IImageConvertInfo) =>
        img.originalFilePath === originalFilePath ? { ...img, quality: quality ?? undefined } : img,
      ),
    });
  };

  // 单张转换/重试:把该行重置为 pending 后单独跑 worker,结果回填;失败重试与成功后重转都走这里
  const handleConvertOne = async (image: IImageConvertInfo) => {
    const filePath = image.originalFilePath;
    const resetImage: IImageConvertInfo = {
      ...image,
      // EImageStatus 仅作为类型导入,枚举值在渲染层直接用字符串字面量
      status: 'pending' as EImageStatus,
      errorMessage: undefined,
      outputFileSize: null,
      outputFilePath: null,
    };
    setConvertingPaths((prev) => [...prev, filePath]);
    try {
      const [result] = await Events.imageConvert({
        data: [resetImage],
        targetFormat: resetImage.targetFormat || defaultTargetFormat,
        quality: resetImage.quality ?? defaultQuality ?? 80,
        width: defaultWidth ?? undefined,
      });
      // 转换期间该行可能已被删除,不再回填
      if (!imagesRef.current.some((img: IImageConvertInfo) => img.originalFilePath === filePath)) return;
      setLocalData({
        [IMAGES_CONVERT_KEY]: imagesRef.current.map((img: IImageConvertInfo) =>
          img.originalFilePath === filePath ? result : img,
        ),
      });
    } catch (error) {
      // 取消或异常:保留该行转换前的状态
    } finally {
      setConvertingPaths((prev) => prev.filter((p) => p !== filePath));
      // 清理该行残留的逐张进度,避免回填后仍显示旧进度行
      const nextProgress = { ...progressRef.current };
      delete nextProgress[filePath];
      progressRef.current = nextProgress;
      setProgress(nextProgress);
    }
  };

  // 清理列表
  const handleClear = () => {
    setLocalData({ [IMAGES_CONVERT_KEY]: [] });
  };

  const columns = [
    {
      title: '文件名称',
      dataIndex: 'fileName',
      key: 'fileName',
    },
    {
      title: '原文件大小',
      dataIndex: 'originalFileSize',
      key: 'originalFileSize',
      width: '11%',
      render: (value: number) => {
        return <div>{formatFileSize(value)}</div>;
      },
    },
    {
      title: '目标格式',
      dataIndex: 'targetFormat',
      key: 'targetFormat',
      width: '12%',
      render: (value: string, record: IImageConvertInfo) => {
        const isConverting = convertingPaths.includes(record.originalFilePath);
        return (
          <Select
            size="small"
            style={{ width: '100%' }}
            value={value}
            disabled={convertLoading || isConverting}
            onChange={(v) => handleChangeTargetFormat(record.originalFilePath, v)}
            options={TARGET_FORMAT_OPTIONS}
          />
        );
      },
    },
    {
      title: '质量',
      dataIndex: 'quality',
      key: 'quality',
      width: '10%',
      render: (value: number | undefined, record: IImageConvertInfo) => {
        const isConverting = convertingPaths.includes(record.originalFilePath);
        return (
          <InputNumber
            size="small"
            style={{ width: '100%' }}
            min={0}
            max={100}
            step={5}
            placeholder="默认"
            value={value ?? null}
            disabled={convertLoading || isConverting}
            onChange={(v) => handleChangeQuality(record.originalFilePath, v)}
          />
        );
      },
    },
    {
      title: '转换后大小',
      dataIndex: 'outputFileSize',
      key: 'outputFileSize',
      width: '11%',
      render: (value: number) => {
        return <div>{value ? formatFileSize(value) : '_'}</div>;
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: '11%',
      render: (value: string, record: IImageConvertInfo) => {
        const text = convertLoading && value === 'pending' ? '转换中...' : STATUS_TEXT_MAP[value] ?? value;
        const node = <div style={{ color: value === 'failure' ? '#ff4d4f' : undefined }}>{text}</div>;
        return value === 'failure' && record.errorMessage ? (
          <Tooltip title={record.errorMessage}>{node}</Tooltip>
        ) : (
          node
        );
      },
    },
    {
      title: '操作',
      key: 'options',
      width: 130,
      render: (data: IImageConvertInfo) => {
        const isConverting = convertingPaths.includes(data.originalFilePath);
        const isFailure = data.status === 'failure';
        return (
          <Space size={8}>
            <Tooltip title={isFailure ? '重试' : '转换'}>
              <Button
                size="small"
                type="text"
                danger={isFailure}
                loading={isConverting}
                disabled={convertLoading || isConverting}
                icon={isFailure ? <RedoOutlined /> : <CompressOutlined />}
                onClick={() => handleConvertOne(data)}
              />
            </Tooltip>
            <Tooltip title="在文件夹中显示">
              <Button
                size="small"
                type="text"
                disabled={convertLoading || isConverting}
                icon={<Icon type="icon-wenjianjia" />}
                onClick={() => handleShowItem(data.outputFilePath || data.originalFilePath)}
              />
            </Tooltip>
            <Tooltip title="删除">
              <Button
                size="small"
                type="text"
                disabled={convertLoading || isConverting}
                icon={<Icon type="icon-guanbi" />}
                onClick={() => handleClearImage(data.originalFilePath)}
              />
            </Tooltip>
          </Space>
        );
      },
    },
  ];

  return (
    <div className={styles['image-convert']}>
      {/* Empty 高度为了撑开表格  */}
      <ConfigProvider
        renderEmpty={() => <Empty style={{ height: tableHeight, paddingTop: 100 }} description="暂无数据" />}
      >
        <Table
          style={{ height: tableHeight }}
          rowKey={IMAGES_DATA_KEY}
          pagination={false}
          scroll={{ y: tableHeight - 60 }}
          columns={columns}
          dataSource={displayImages}
        />
      </ConfigProvider>
      <div className={styles['image-convert-footer']}>
        <Space size={12}>
          <div>
            默认格式：
            <Select
              size="small"
              style={{ width: 90 }}
              value={defaultTargetFormat}
              onChange={setDefaultTargetFormat}
              options={TARGET_FORMAT_OPTIONS}
            />
          </div>
          <div>
            默认质量：
            <InputNumber
              size="small"
              style={{ width: 80 }}
              min={0}
              max={100}
              step={5}
              value={defaultQuality}
              onChange={setDefaultQuality}
            />
          </div>
          <div>
            宽度(px)：
            <InputNumber
              size="small"
              style={{ width: 90 }}
              min={1}
              step={10}
              placeholder="原尺寸"
              value={defaultWidth}
              onChange={setDefaultWidth}
            />
          </div>
        </Space>

        <Space>
          <Button size="large" icon={<UploadOutlined />} onClick={handleUploadImages}>
            上传图片
          </Button>
          <Button
            size="large"
            type="primary"
            icon={<CompressOutlined />}
            loading={convertLoading}
            disabled={convertLoading || convertingPaths.length > 0}
            onClick={handleConvert}
          >
            开始转换
          </Button>
          {convertLoading && (
            <Button size="large" danger icon={<StopOutlined />} onClick={handleCancel}>
              取消
            </Button>
          )}
          <Button size="large" icon={<ClearOutlined />} onClick={handleClear}>
            清理列表
          </Button>
        </Space>
      </div>
    </div>
  );
};

export default ImageConvert;
