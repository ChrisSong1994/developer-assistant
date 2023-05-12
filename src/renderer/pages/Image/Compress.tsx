import { FileAddOutlined, FolderAddOutlined } from '@ant-design/icons';
import { Button, ConfigProvider, Segmented, Space, Table } from 'antd';
import { useMemo, useState } from 'react';

import Empty from '@/components/Empty';
import Icon from '@/components/Icon';
import { useWindowSize } from '@/hooks';
import { arrayObjDeWightByKey } from '@/utils';
import Events from '@/utils/events';
import { IImageCompressInfo } from '../../../main/modules/image';

import styles from './index.less';

const IMAGES_DATA_KEY = 'originalFilePath';
const TABLE_HEIGHT_PADDING = 230;

const Compress = () => {
  const [images, setImages] = useState<Array<IImageCompressInfo>>([]);
  const [compressLoading, setCompressLoading] = useState<boolean>(false);
  const [quality, setQuality] = useState<number>(80);
  const { height } = useWindowSize();
  const tableHeight = useMemo(() => height - TABLE_HEIGHT_PADDING, [height]); // 编辑器高度

  const handleUploadImages = async () => {
    const result = await Events.uploadImages({
      filters: [{ name: '图片选择', extensions: ['*.png', '*.jpg', '*.jpeg', '*.webp'] }],
    });
    if (result) {
      const newImages = arrayObjDeWightByKey([...images, ...result], IMAGES_DATA_KEY); // 基于 originalFilePath 去重
      setImages(newImages);
    }
  };

  const handleCompress = async () => {
    setCompressLoading(true);
    const result = await Events.imageCompress({
      data: images,
      quality: quality,
    });
    // @ts-ignore
    if (result) setImages(result);
    setCompressLoading(false);
  };

  const handleShowItem = async (filePath: string) => {
    await Events.showItemInFolder({ path: filePath });
  };

  const handleClearImage = (originalFilePath: string) => {
    setImages(images.filter((v: IImageCompressInfo) => v.originalFilePath !== originalFilePath));
  };

  // 清理列表
  const handleClear = () => {
    setImages([]);
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
    },
    {
      title: '压缩后大小',
      dataIndex: 'compreeedFileSize',
      key: 'compreeedFileSize',
      width: '12%',
      render: (value: string) => {
        return <div>{value || '_'}</div>;
      },
    },
    {
      title: '压缩率',
      dataIndex: 'compressedRatio',
      key: 'compressedRatio',
      width: '12%',
      render: (value: string) => {
        return <div>{value || '_'}</div>;
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
      <Space style={{ paddingBottom: 12 }}>
        <Button icon={<FileAddOutlined />} onClick={handleUploadImages}>
          上传图片
        </Button>
      </Space>
      {/* Empty 设置高度为了撑开表格  */}
      <ConfigProvider
        renderEmpty={() => <Empty style={{ height: tableHeight - 90, paddingTop: 30 }} description="暂无数据" />}
      >
        <Table
          style={{ height: tableHeight }}
          rowKey={IMAGES_DATA_KEY}
          pagination={false}
          scroll={{ y: tableHeight }}
          columns={columns}
          dataSource={images}
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
          <Button size="large" type="primary" icon={<FileAddOutlined />} onClick={handleCompress}>
            开始压缩
          </Button>
          <Button size="large" icon={<FolderAddOutlined />} onClick={handleClear}>
            清理列表
          </Button>
        </Space>
      </div>
    </div>
  );
};

export default Compress;
