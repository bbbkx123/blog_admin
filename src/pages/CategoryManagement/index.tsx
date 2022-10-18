import {
  addOrEditArticleCategory,
  // removeArticle,
  // getArticlePage,
  // updateRule,
  updateStatus,
  // fetchArticleCategoryList,
} from '@/services/ant-design-pro/api';
import { fetchArticleCategoryPage, deleteArticleCategory } from '@/services/admin-api';
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
  // ProFormTextArea,
  ProTable,
  // ProFormSelect,
  ProForm,
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
// const handleAdd = async (fields: API.ArticleCategoryListItem) => {
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
const handleRemove = async (selectedRows: API.ArticleCategoryListItem[]) => {
  const ids = (selectedRows || []).reduce((prev: any, cur: any, index: number) => {
    return prev + cur?.id + (index === selectedRows.length - 1 ? '' : ',');
  }, '');
  // console.log('ids --> ', ids);
  // console.log('selectedRows --> ', selectedRows);
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    await deleteArticleCategory(ids);
    hide();
    message.success('删除成功');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败');
    return false;
  }
};

const CategoryManagement: React.FC = () => {
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
  // const [currentRow, setCurrentRow] = useState<API.ArticleCategoryListItem>();
  const [selectedRowsState, setSelectedRows] = useState<API.ArticleCategoryListItem[]>([]);
  const [pagination, setPagination] = useState<any>({
    pageSizeOptions: [10, 20, 50],
  });
  const [dataSource, setDataSource] = useState<any>([]);
  const [operation, setOperation] = useState<string>('');
  // const [categoryList, setCategoryList] = useState<any[]>([]);

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

    const res = await fetchArticleCategoryPage({ ..._pagination, ...tempCondition });
    const { list, ...rest } = (res as { data: any }).data;
    setPagination(rest);
    setDataSource([...(list || [])]);
  };

  const handleTableChange = async (_pagination: any, filters: any, sorter: any, extra: any) => {
    const { action } = extra;
    if (action === 'paginate') {
      await handleLoad(_pagination);
    }
  };

  // 初始化加载列表数据
  useEffect(() => {
    const _pagination: any = {
      current: 1,
      pageSize: 10,
    };
    handleLoad(_pagination);
    const { id }: any = JSON.parse(localStorage.getItem('user') as string);
    form.setFieldsValue({ uid: id });
  }, [form]);

  useEffect(() => {
    if (!createModalVisible) {
      form.resetFields();
    } else {
    }
  }, [createModalVisible, form]);

  // const categoryOptions = useMemo(() => {
  //   return (categoryList || []).map((item: any) => {
  //     const { category_type, category_name } = item;
  //     return {
  //       value: category_type,
  //       label: category_name,
  //     };
  //   });
  // }, [categoryList]);

  const columns: ProColumns<API.ArticleCategoryListItem>[] = [
    {
      title: '分类',
      dataIndex: 'category_name',
      render: (_: any, record: any) => record.category_name,
    },
    // {
    //   title: '创建者',
    //   dataIndex: 'author',
    //   width: 120,
    //   search: false,
    // },
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
        (record?.status === 'enable' || record?.status === 'disable') && (
          <Button
            key="enable"
            ghost
            type="primary"
            danger={record?.status === 'enable'}
            size="small"
            onClick={async () => {
              const status = record?.status === 'enable' ? '2' : '1';
              await updateStatus({ status, id: record?.id });
              message.success('成功');
              handleLoad({ ...pagination });
            }}
          >
            {record?.status === 'enable' ? '停用' : '启用'}
          </Button>
        ),
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.ArticleCategoryListItem, API.PageParams>
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
              const { id }: any = JSON.parse(localStorage.getItem('user') as string);
              form.setFieldsValue({ uid: id });
            }}
          >
            <PlusOutlined /> <FormattedMessage id="pages.searchTable.new" defaultMessage="New" />
          </Button>,
        ]}
        // request={getArticlePage}
        pagination={pagination}
        dataSource={dataSource}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
        onChange={handleTableChange}
        onSubmit={async (params: any) => {
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
        title={'分类'}
        width="300px"
        visible={createModalVisible}
        onVisibleChange={handleModalVisible}
        onFinish={async (value) => {
          if (operation !== 'add' && operation !== 'edit') {
            return;
          }
          const { success, msg }: any = await addOrEditArticleCategory(
            value as API.ArticleCategoryListItem,
          );
          if (success) {
            message.success(msg);
            handleModalVisible(false);
            if (actionRef.current) {
              actionRef.current.reload();
              handleLoad({ ...pagination });
            }
          }
        }}
      >
        <ProForm.Item noStyle name="uid" rules={[{ required: true }]}>
          <Input style={{ display: 'none' }} />
        </ProForm.Item>
        <ProForm.Item noStyle name="id">
          <Input style={{ display: 'none' }} />
        </ProForm.Item>
        <ProFormText
          label="分类名称"
          rules={[
            {
              required: true,
            },
          ]}
          width="md"
          name="category_name"
        />
        <ProFormText
          label="分类代码"
          rules={[
            {
              required: true,
            },
          ]}
          width="md"
          name="category_type"
        />
      </ModalForm>
    </PageContainer>
  );
};

export default CategoryManagement;
