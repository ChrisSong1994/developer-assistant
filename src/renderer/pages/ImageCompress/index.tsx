import { ClearOutlined, CompressOutlined, StopOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, ConfigProvider, Segmented, Space, Table } from 'antd';
import { useEffect, useMemo, useRef, useState } from 'react';

import Empty from '@/renderer/components/Empty';
import Icon from '@/renderer/components/Icon';
import { useLocalData, useWindowSize } from '@/renderer/hooks';
import { arrayObjDeWightByKey, formatFileSize } from '@/renderer/utils';
import Events from '@/renderer/utils/events';
import { IImageCompressInfo } from '../../../main/modules/image';

import styles from './index.module.less';

const IMAGES_DATA_KEY = 'originalFilePath';
const IMAGES_COMPRESS_KEY = 'images_compress';
const TABLE_HEIGHT_PADDING = 170;

const ImageCompress = () => {
  const { data: localData, setData: setLocalData } = useLocalData();
  const images = localData?.[IMAGES_COMPRESS_KEY] || [];
  const [compressLoading, setCompressLoading] = useState<boolean>(false);
  const [quality, setQuality] = useState<number>(80);
  const { height } = useWindowSize();
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
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: '18%',
      render: (value: string) => {
        return <div>{compressLoading && value === 'pending' ? '压缩中...' : value}</div>;
      },
    },
    {
      title: '操作',
      key: 'options',
      width: 100,
      render: (data: IImageCompressInfo) => {
        return (
          <Space>
            <Icon
              type="icon-wenjianjia"
              onClick={() => handleShowItem(data.compreeedFilePath || data.originalFilePath)}
            />
            <Icon type="icon-guanbi" onClick={() => handleClearImage(data.originalFilePath)} />
          </Space>
        );
      },
    },
  ];

  return (
    <div className={styles['image-compress']}>
      {/* Empty 高度为了撑开表格  */}
      <ConfigProvider
        renderEmpty={() => <Empty style={{ height: tableHeight - 100, paddingTop: 100 }} description="暂无数据" />}
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
            压缩质量：
            <Segmented
              value={quality}
              onChange={(v) => setQuality(v as number)}
              options={[
                { label: '高', value: 80 },
                { label: '中', value: 50 },
                { label: '低', value: 30 },
              ]}
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
            loading={compressLoading}
            disabled={compressLoading}
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
