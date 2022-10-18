import {
  addOrEditArticle,
  removeArticle,
  // updateRule,
  // updateStatus,
} from '@/services/ant-design-pro/api';
import { fetchArticleCategoryList } from '@/services/admin-api';

import { getArticlePage } from '@/services/admin-api';

import { PlusOutlined } from '@ant-design/icons';
import type {
  ActionType,
  ProColumns,
  // ProDescriptionsItemProps
} from '@ant-design/pro-components';
import {
  FooterToolbar,
  ModalForm,
  PageContainer,
  // ProDescriptions,
  ProFormText,
  ProFormTextArea,
  ProTable,
  ProFormSelect,
  ProForm,
  ProFormUploadButton,
} from '@ant-design/pro-components';
import { FormattedMessage, useIntl } from '@umijs/max';
import {
  Button,
  // Drawer,
  Input,
  message,
} from 'antd';
import { useForm } from 'antd/es/form/Form';
import React, { useRef, useState, useEffect, useMemo } from 'react';
// import type { FormValueType } from './components/UpdateForm';
// import UpdateForm from './components/UpdateForm';

/**
 * @en-US Add node
 * @zh-CN 添加节点
 * @param fields
 */
// const handleAdd = async (fields: API.ArticleListItem) => {
//   const hide = message.loading('正在添加');
//   try {
//     await addArticle({ ...fields });
//     hide();
//     message.success('添加成功');
//     return true;
//   } catch (error) {
//     hide();
//     message.error('操作失败');
//     return false;
//   }
// };

// /**
//  * @en-US Update node
//  * @zh-CN 更新节点
//  *
//  * @param fields
//  */
// const handleUpdate = async (fields: FormValueType) => {
//   const hide = message.loading('Configuring');
//   try {
//     await updateRule({
//       name: fields.name,
//       desc: fields.desc,
//       key: fields.key,
//     });
//     hide();

//     message.success('Configuration is successful');
//     return true;
//   } catch (error) {
//     hide();
//     message.error('Configuration failed, please try again!');
//     return false;
//   }
// };

/**
 *  Delete node
 * @zh-CN 删除节点
 *
 * @param selectedRows
 */
const handleRemove = async (selectedRows: API.ArticleListItem[]) => {
  const ids = (selectedRows || []).reduce((prev: any, cur: any, index: number) => {
    return prev + cur?.id + (index === selectedRows.length - 1 ? '' : ',');
  }, '');
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    await removeArticle(ids);
    hide();
    message.success('删除成功');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败');
    return false;
  }
};

const TableList: React.FC = () => {
  /**
   * @en-US Pop-up window of new window
   * @zh-CN 新建窗口的弹窗
   *  */
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  /**
   * @en-US The pop-up window of the distribution update window
   * @zh-CN 分布更新窗口的弹窗
   * */
  // const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);

  // const [showDetail, setShowDetail] = useState<boolean>(false);
  const [form] = useForm();
  const actionRef = useRef<ActionType>();
  // const [currentRow, setCurrentRow] = useState<API.ArticleListItem>();
  const [selectedRowsState, setSelectedRows] = useState<API.ArticleListItem[]>([]);
  const [pagination, setPagination] = useState<any>({ current: 1, pageSize: 10 });
  const [dataSource, setDataSource] = useState<any>([]);
  const [operation, setOperation] = useState<string>('');
  // const [fileList, setFileList] = useState<any[]>([]);
  const [categoryList, setCategoryList] = useState<any[]>([]);

  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  const intl = useIntl();

  const handleLoad = async (_pagination: any, condition?: any) => {
    const tempCondition: any = Object.keys(condition || {}).reduce((prev: any, cur: string) => {
      return {
        ...prev,
        [cur]: condition[cur] === '' ? undefined : condition[cur],
      };
    }, {});
    const res = await getArticlePage({
      pageSize: _pagination?.pageSize,
      current: _pagination?.current,
      ...tempCondition,
    });
    const { list, current, pageSize, total } = (res as { data: any }).data;
    setPagination({ current, pageSize, total });
    setDataSource([...(list || [])]);
  };

  const handleTableChange = async (_pagination: any, filters: any, sorter: any, extra: any) => {
    const { action } = extra;
    if (action === 'paginate') {
      await handleLoad(_pagination);
    }
  };

  const mergePagination: any = useMemo(() => {
    return {
      ...pagination,
      pageSizeOptions: [10, 20, 50],
    };
  }, [pagination]);

  // 初始化加载列表数据
  useEffect(() => {
    const _pagination: any = {
      current: 1,
      pageSize: 10,
    };
    handleLoad(_pagination);
    const { id, username }: any = JSON.parse(localStorage.getItem('user') as string);
    form.setFieldsValue({ author_id: id, author: username });
  }, [form]);

  //
  useEffect(() => {
    const fn = async () => {
      const res = await fetchArticleCategoryList();
      setCategoryList([...(res?.data?.list || [])]);
    };
    fn();
  }, []);

  useEffect(() => {
    if (!createModalVisible) {
      form.resetFields();
    } else {
    }
  }, [createModalVisible, form]);

  const category = useMemo(() => {
    return (categoryList || []).reduce((prev: any, cur: any) => {
      const { category_type, category_name } = cur;
      return {
        ...prev,
        [category_type]: {
          text: category_name,
          status: category_type,
        },
      };
    }, {});
  }, [categoryList]);

  const categoryOptions = useMemo(() => {
    return (categoryList || []).map((item: any) => {
      const { category_type, category_name } = item;
      return {
        value: category_type,
        label: category_name,
      };
    });
  }, [categoryList]);

  const columns: ProColumns<API.ArticleListItem>[] = [
    {
      title: '作者',
      dataIndex: 'author',
      width: 120,
    },
    {
      title: '标题',
      dataIndex: 'title',
    },
    {
      title: '分类',
      dataIndex: 'category',
      valueEnum: category,
      valueType: 'select',
    },
    {
      title: '创建时间',
      key: 'showTime',
      dataIndex: 'create_time',
      valueType: 'date',
      sorter: true,
      hideInSearch: true,
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      valueType: 'dateRange',
      hideInTable: true,
      search: {
        transform: (value) => {
          return {
            startTime: value[0],
            endTime: value[1],
          };
        },
      },
    },
    {
      title: '阅读量',
      dataIndex: 'read_counts',
      // valueType: 'text',
      search: false,
    },
    {
      title: <FormattedMessage id="pages.searchTable.titleOption" defaultMessage="Operating" />,
      dataIndex: 'option',
      valueType: 'option',
      width: 150,
      fixed: 'right',
      render: (_, record) => [
        <Button
          key="edit"
          ghost
          type="primary"
          size="small"
          onClick={() => {
            setOperation('edit');
            handleModalVisible(true);
            form.setFieldsValue({ ...record });
            if (record?.pic) {
              form.setFieldsValue({
                upload: [
                  {
                    uid: 'xxxxxx',
                    name: 'xxxxxx',
                    url: `${record?.pic}`,
                  },
                ],
              });
            }
          }}
        >
          编辑
        </Button>,
        <Button
          key="remove"
          ghost
          danger
          size="small"
          onClick={async () => {
            await handleRemove([record]);
            handleLoad({ ...pagination });
          }}
        >
          删除
        </Button>,
        // (record?.status === 'enable' || record?.status === 'disable') && (
        //   <Button
        //     key="enable"
        //     ghost
        //     type="primary"
        //     danger={record?.status === 'enable'}
        //     size="small"
        //     onClick={async () => {
        //       const status = record?.status === 'enable' ? '2' : '1';
        //       await updateStatus({ status, id: record?.id });
        //       message.success('成功');
        //       handleLoad({ ...pagination });
        //     }}
        //   >
        //     {record?.status === 'enable' ? '停用' : '启用'}
        //   </Button>
        // ),
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.ArticleListItem, API.PageParams>
        headerTitle={intl.formatMessage({
          id: 'pages.searchTable.title',
          defaultMessage: 'Enquiry form',
        })}
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              setOperation('add');
              handleModalVisible(true);
              const { id = '', username = '' } = JSON.parse(localStorage.getItem('user') as string);
              form.setFieldsValue({
                author_id: id,
                author: username,
              });
            }}
          >
            <PlusOutlined /> <FormattedMessage id="pages.searchTable.new" defaultMessage="New" />
          </Button>,
        ]}
        // request={getArticlePage}
        pagination={mergePagination}
        dataSource={dataSource}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
        onChange={handleTableChange}
        onSubmit={async (params: any) => {
          // console.log('paginationpaginationpagination --> ', pagination);
          await handleLoad({ ...pagination, current: 1 }, params);
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              <FormattedMessage id="pages.searchTable.chosen" defaultMessage="Chosen" />{' '}
              <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a>{' '}
              <FormattedMessage id="pages.searchTable.item" defaultMessage="项" />
              {/* &nbsp;&nbsp; */}
              {/* <span>
                <FormattedMessage
                  id="pages.searchTable.totalServiceCalls"
                  defaultMessage="Total number of service calls"
                />{' '}
                {selectedRowsState.reduce((pre, item) => pre + item.callNo!, 0)}{' '}
                <FormattedMessage id="pages.searchTable.tenThousand" defaultMessage="万" />
              </span> */}
            </div>
          }
        >
          <Button
            onClick={async () => {
              await handleRemove(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
              handleLoad({ ...pagination });
            }}
          >
            <FormattedMessage
              id="pages.searchTable.batchDeletion"
              defaultMessage="Batch deletion"
            />
          </Button>
          {/* <Button type="primary">
            <FormattedMessage
              id="pages.searchTable.batchApproval"
              defaultMessage="Batch approval"
            />
          </Button> */}
        </FooterToolbar>
      )}
      <ModalForm
        form={form}
        title={operation === 'add' ? '新增' : operation === 'edit' ? '编辑' : 'title'}
        width="800px"
        visible={createModalVisible}
        onVisibleChange={handleModalVisible}
        onFinish={async (value) => {
          if (operation !== 'add' && operation !== 'edit') {
            return;
          }
          const { upload, ...rest } = value;
          const params = {
            ...rest,
            pic: `https://www.kkkiana.club/image/${upload[0].name}`,
          };
          try {
            const { success, msg }: any = await addOrEditArticle(params as API.ArticleListItem);
            if (success) {
              message.success(msg);
              handleModalVisible(false);
              if (actionRef.current) {
                actionRef.current.reload();
                handleLoad({ ...pagination });
              }
            }
          } catch (err: any) {
            message.error(err?.response?.data?.msg);
          }
        }}
      >
        <ProForm.Item noStyle name="author_id" rules={[{ required: true }]}>
          <Input style={{ display: 'none' }} />
        </ProForm.Item>
        <ProForm.Item noStyle name="id">
          <Input style={{ display: 'none' }} />
        </ProForm.Item>
        <ProFormText
          label="标题"
          rules={[
            {
              required: true,
            },
          ]}
          width="md"
          name="title"
        />
        <ProFormText label="作者" width="md" name="author" rules={[{ required: true }]} disabled />
        <ProForm.Item noStyle name="pic">
          <Input style={{ display: 'none' }} />
        </ProForm.Item>
        <ProFormUploadButton
          rules={[{ required: true }]}
          name="upload"
          label="封面"
          max={1}
          fieldProps={{
            name: 'file',
            listType: 'picture-card',
            headers: {
              Authorization: localStorage.getItem('token') as string,
            },
            maxCount: 1,
            onRemove: () => {
              form.setFieldsValue({
                upload: [],
              });
            },
          }}
          action="/api/article/uploadFile"
        />
        <ProFormSelect
          options={categoryOptions}
          width="md"
          name="category"
          label="文章类别"
          rules={[{ required: true }]}
        />

        <ProFormTextArea
          label="内容"
          // width="md"
          name="content"
          rules={[{ required: true }]}
        />
      </ModalForm>
      {/* <UpdateForm
        onSubmit={async (value) => {
          const success = await handleUpdate(value);
          if (success) {
            handleUpdateModalVisible(false);
            setCurrentRow(undefined);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => {
          handleUpdateModalVisible(false);
          if (!showDetail) {
            setCurrentRow(undefined);
          }
        }}
        updateModalVisible={updateModalVisible}
        values={(currentRow as any) || {}}
      /> */}
    </PageContainer>
  );
};

export default TableList;
