import { ClearOutlined, CompressOutlined, RedoOutlined, StopOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, ConfigProvider, Segmented, Space, Table, Tooltip } from 'antd';
import { useEffect, useMemo, useRef, useState } from 'react';

import Empty from '@/renderer/components/Empty';
import Icon from '@/renderer/components/Icon';
import { useLocalData, useWindowSize } from '@/renderer/hooks';
import { arrayObjDeWightByKey, formatFileSize } from '@/renderer/utils';
import Events from '@/renderer/utils/events';
// 注意:只能 type 导入,main/modules/image 依赖 worker_threads/electron/sharp,
// 若运行时导入会把主进程模块打进 web bundle 导致 "Can't resolve 'worker_threads'"
import type { EImageStatus, IImageCompressInfo } from '../../../main/modules/image';

import styles from './index.module.less';

const IMAGES_DATA_KEY = 'originalFilePath';
const IMAGES_COMPRESS_KEY = 'images_compress';
const TABLE_HEIGHT_PADDING = 110;

const QUALITY_OPTIONS = [
  { label: '高', value: 80 },
  { label: '中', value: 50 },
  { label: '低', value: 30 },
];

const STATUS_TEXT_MAP: Record<string, string> = {
  pending: '待处理',
  success: '已完成',
  failure: '失败',
};

const ImageCompress = () => {
  const { data: localData, setData: setLocalData } = useLocalData();
  const images = localData?.[IMAGES_COMPRESS_KEY] || [];
  const [compressLoading, setCompressLoading] = useState<boolean>(false);
  const [quality, setQuality] = useState<number>(80);
  // 正在单张压缩的文件路径,用于行内 loading 与按钮禁用
  const [compressingPaths, setCompressingPaths] = useState<string[]>([]);
  const { height } = useWindowSize();
  // 最新 images 快照:异步回调 resolve 时读取,避免闭包陈旧导致丢行/回填已删行
  const imagesRef = useRef<IImageCompressInfo[]>(images);
  imagesRef.current = images;
  const tableHeight = useMemo(() => height - TABLE_HEIGHT_PADDING, [height]); // 编辑器高度

  // 压缩中逐张进度:镜像到 state 供表格实时渲染,同时存 ref 供异常/取消时合并
  const [progress, setProgress] = useState<Record<string, IImageCompressInfo>>({});
  const progressRef = useRef<Record<string, IImageCompressInfo>>({});
  const applyProgress = (img: IImageCompressInfo) => {
    progressRef.current[img.originalFilePath] = img;
    setProgress({ ...progressRef.current });
  };
  const clearProgress = () => {
    progressRef.current = {};
    setProgress({});
  };
  // 表格数据源:未完成的用原始行,已完成的用进度行(基于 originalFilePath 对应 rowKey,稳定)
  const displayImages = useMemo(
    () => images.map((img: IImageCompressInfo) => progress[img.originalFilePath] ?? img),
    [images, progress],
  );

  useEffect(() => {
    const unsubscribe = window.electronBridge?.on('imageCompress:item', (img) => applyProgress(img));
    return () => {
      unsubscribe?.();
    };
  }, []);

  const handleUploadImages = async () => {
    const result = await Events.uploadImages({
      filters: [{ name: '图片选择', extensions: ['*.png', '*.jpg', '*.jpeg', '*.webp'] }],
    });
    if (result) {
      const newImages = arrayObjDeWightByKey([...images, ...result], IMAGES_DATA_KEY); // 基于 originalFilePath 去重
      setLocalData({ [IMAGES_COMPRESS_KEY]: newImages });
    }
  };

  const handleCompress = async () => {
    setCompressLoading(true);
    clearProgress();
    try {
      const result = await Events.imageCompress({
        data: images,
        quality: quality,
      });
      // @ts-ignore
      if (result) setLocalData({ [IMAGES_COMPRESS_KEY]: result });
    } catch (error) {
      // 取消或异常:保留已完成的逐张结果,一次持久化
      const keepImages = images.map((img: IImageCompressInfo) => progressRef.current[img.originalFilePath] ?? img);
      setLocalData({ [IMAGES_COMPRESS_KEY]: keepImages });
    } finally {
      clearProgress();
      setCompressLoading(false);
    }
  };

  const handleCancel = async () => {
    await Events.cancelImageCompress();
  };

  const handleShowItem = async (filePath: string) => {
    await Events.showItemInFolder({ path: filePath });
  };

  const handleClearImage = (originalFilePath: string) => {
    setLocalData({
      [IMAGES_COMPRESS_KEY]: images.filter((v: IImageCompressInfo) => v.originalFilePath !== originalFilePath),
    });
  };

  // 单张质量调整:仅更新该行,未设置的图片在压缩时仍用默认质量
  const handleChangeQuality = (originalFilePath: string, quality: number) => {
    setLocalData({
      [IMAGES_COMPRESS_KEY]: images.map((img: IImageCompressInfo) =>
        img.originalFilePath === originalFilePath ? { ...img, quality } : img,
      ),
    });
  };

  // 单张压缩/重试:把该行重置为 pending 后单独跑 worker,结果回填;失败重试与成功后重压都走这里
  const handleCompressOne = async (image: IImageCompressInfo) => {
    const filePath = image.originalFilePath;
    const resetImage: IImageCompressInfo = {
      ...image,
      // EImageStatus 仅作为类型导入,枚举值在渲染层直接用字符串字面量
      status: 'pending' as EImageStatus,
      errorMessage: undefined,
      compreeedFileSize: null,
      compreeedFilePath: null,
      compressedRatio: null,
    };
    setCompressingPaths((prev) => [...prev, filePath]);
    try {
      const [result] = await Events.imageCompress({
        data: [resetImage],
        quality: resetImage.quality ?? quality,
      });
      // 压缩期间该行可能已被删除,不再回填
      if (!imagesRef.current.some((img: IImageCompressInfo) => img.originalFilePath === filePath)) return;
      setLocalData({
        [IMAGES_COMPRESS_KEY]: imagesRef.current.map((img: IImageCompressInfo) =>
          img.originalFilePath === filePath ? result : img,
        ),
      });
    } catch (error) {
      // 取消或异常:保留该行压缩前的状态
    } finally {
      setCompressingPaths((prev) => prev.filter((p) => p !== filePath));
      // 清理该行残留的逐张进度,避免回填后仍显示旧进度行
      const nextProgress = { ...progressRef.current };
      delete nextProgress[filePath];
      progressRef.current = nextProgress;
      setProgress(nextProgress);
    }
  };

  // 清理列表
  const handleClear = () => {
    setLocalData({ [IMAGES_COMPRESS_KEY]: [] });
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
      width: '12%',
      render: (value: number) => {
        return <div>{formatFileSize(value)}</div>;
      },
    },
    {
      title: '压缩后大小',
      dataIndex: 'compreeedFileSize',
      key: 'compreeedFileSize',
      width: '12%',
      render: (value: number) => {
        return <div>{value ? formatFileSize(value) : '_'}</div>;
      },
    },
    {
      title: '压缩率',
      dataIndex: 'compressedRatio',
      key: 'compressedRatio',
      width: '12%',
      render: (value: number) => {
        return <div>{value ? `${value}%` : '_'}</div>;
      },
    },
    {
      title: '质量',
      dataIndex: 'quality',
      key: 'quality',
      width: '12%',
      render: (_: number, record: IImageCompressInfo) => {
        const isCompressing = compressingPaths.includes(record.originalFilePath);
        return (
          <Segmented
            size="small"
            value={record.quality ?? quality}
            disabled={compressLoading || isCompressing}
            onChange={(v) => handleChangeQuality(record.originalFilePath, v as number)}
            options={QUALITY_OPTIONS}
          />
        );
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: '14%',
      render: (value: string, record: IImageCompressInfo) => {
        const text = compressLoading && value === 'pending' ? '压缩中...' : STATUS_TEXT_MAP[value] ?? value;
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
      render: (data: IImageCompressInfo) => {
        const isCompressing = compressingPaths.includes(data.originalFilePath);
        const isFailure = data.status === 'failure';
        return (
          <Space size={8}>
            <Tooltip title={isFailure ? '重试' : '压缩'}>
              <Button
                size="small"
                type="text"
                danger={isFailure}
                loading={isCompressing}
                disabled={compressLoading || isCompressing}
                icon={isFailure ? <RedoOutlined /> : <CompressOutlined />}
                onClick={() => handleCompressOne(data)}
              />
            </Tooltip>
            <Tooltip title="在文件夹中显示">
              <Button
                size="small"
                type="text"
                disabled={compressLoading || isCompressing}
                icon={<Icon type="icon-wenjianjia" />}
                onClick={() => handleShowItem(data.compreeedFilePath || data.originalFilePath)}
              />
            </Tooltip>
            <Tooltip title="删除">
              <Button
                size="small"
                type="text"
                disabled={compressLoading || isCompressing}
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
    <div className={styles['image-compress']}>
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
      <div className={styles['image-compress-footer']}>
        <Space>
          <div>
            默认质量：
            <Segmented value={quality} onChange={(v) => setQuality(v as number)} options={QUALITY_OPTIONS} />
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
            loading={compressLoading}
            disabled={compressLoading || compressingPaths.length > 0}
            onClick={handleCompress}
          >
            开始压缩
          </Button>
          {compressLoading && (
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

export default ImageCompress;
