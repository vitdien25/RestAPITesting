import React from "react";
import { Button, Card, Space, Table, Tag, Popconfirm, Typography } from "antd";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { ColumnsType } from "antd/es/table";
import { useEmployees, useDeleteEmployee } from "../hooks/useEmployee";
import type { Employee } from "../types/employee";
import { Gender } from "../types/employee";
import dayjs from "dayjs";

const { Title } = Typography;

const EmployeeList: React.FC = () => {
  const navigate = useNavigate();
  const { data: employeesResponse, isLoading, error } = useEmployees();
  const deleteEmployee = useDeleteEmployee();

  const employees = employeesResponse?.data || [];

  const handleDelete = (id: number) => {
    deleteEmployee.mutate(id);
  };

  const columns: ColumnsType<Employee> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 60,
    },
    {
      title: "Full Name",
      dataIndex: "fullName",
      key: "fullName",
      ellipsis: true,
      width: 180,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      ellipsis: true,
      width: 200,
    },
    {
      title: "Date of Birth",
      dataIndex: "dateOfBirth",
      key: "dateOfBirth",
      render: (date: string) => dayjs(date).format("DD/MM/YYYY"),
      width: 130,
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
      render: (gender: string) => {
        const map: Record<string, string> = {
          [Gender.MALE]: "blue",
          [Gender.FEMALE]: "pink",
          [Gender.OTHER]: "gold",
        };
        const color = map[gender] ?? "default";
        return <Tag color={color}>{gender}</Tag>;
      },
      width: 100,
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      width: 120,
    },
    {
      title: "Status",
      dataIndex: "active",
      key: "active",
      render: (active: boolean) => (
        <Tag color={active ? "green" : "red"}>
          {active ? "Active" : "Inactive"}
        </Tag>
      ),
      width: 100,
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => dayjs(date).format("DD/MM/YYYY HH:mm"),
      width: 160,
    },
    {
      title: "Actions",
      key: "actions",
      width: 200,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            icon={<Eye size={16} />}
            onClick={() => navigate(`/employees/${record.id}`)}
          >
            View
          </Button>
          <Button
            type="default"
            size="small"
            icon={<Edit size={16} />}
            onClick={() => navigate(`/employees/${record.id}/edit`)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete Employee"
            description="Are you sure you want to delete this employee?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true }}
          >
            <Button
              danger
              size="small"
              icon={<Trash2 size={16} />}
              loading={deleteEmployee.isPending}
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (error) {
    return (
      <Card>
        <div style={{ textAlign: "center", padding: "50px 0" }}>
          <Typography.Text type="danger">
            Failed to load employees. Please try again.
          </Typography.Text>
        </div>
      </Card>
    );
  }

  return (
    <div>
      <div
        style={{
          marginBottom: 16,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Title level={2} style={{ margin: 0 }}>
          Employee Management
        </Title>
        <Button
          type="primary"
          icon={<Plus size={20} />}
          size="large"
          onClick={() => navigate("/employees/create")}
        >
          Add Employee
        </Button>
      </div>

      <Card style={{ border: "1px solid rgba(0,0,0,0.06)" }}>
        <Table
          columns={columns}
          dataSource={employees}
          rowKey="id"
          loading={isLoading}
          pagination={{
            pageSizeOptions: [5, 10, 20, 50],
            defaultPageSize: 5,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} employees`,
          }}
          rowClassName={() => "employee-row"}
          scroll={{ x: 1200 }}
          bordered
        />
      </Card>
    </div>
  );
};

export default EmployeeList;
