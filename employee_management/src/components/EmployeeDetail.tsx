import React from "react";
import { Button, Card, Descriptions, Space, Tag, Typography, Spin } from "antd";
import { ArrowLeft, Edit } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useEmployee } from "../hooks/useEmployee";
import { Gender } from "../types/employee";
import dayjs from "dayjs";

const { Title } = Typography;

const EmployeeDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const employeeId = parseInt(id || "0", 10);

  const { data: employeeResponse, isLoading, error } = useEmployee(employeeId);
  const employee = employeeResponse?.data;

  if (isLoading) {
    return (
      <div style={{ textAlign: "center", padding: "50px 0" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error || !employee) {
    return (
      <Card>
        <div style={{ textAlign: "center", padding: "50px 0" }}>
          <Typography.Text type="danger">
            Employee not found or failed to load employee details.
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
          Employee Details
        </Title>
        <Space>
          <Button
            type="primary"
            icon={<Edit size={20} />}
            onClick={() => navigate(`/employees/${employee.id}/edit`)}
          >
            Edit Employee
          </Button>
          <Button icon={<ArrowLeft size={20} />} onClick={() => navigate("/")}>
            Back to List
          </Button>
        </Space>
      </div>

      <Card>
        <Descriptions
          title={`Employee ID: ${employee.id}`}
          bordered
          column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}
          labelStyle={{ fontWeight: 600 }}
        >
          <Descriptions.Item label="Full Name">
            {employee.fullName}
          </Descriptions.Item>

          <Descriptions.Item label="Email">{employee.email}</Descriptions.Item>

          <Descriptions.Item label="Date of Birth">
            {dayjs(employee.dateOfBirth).format("DD/MM/YYYY")}
          </Descriptions.Item>

          <Descriptions.Item label="Gender">
            {(() => {
              const map: Record<string, string> = {
                [Gender.MALE]: "blue",
                [Gender.FEMALE]: "pink",
                [Gender.OTHER]: "gold",
              };
              const color = map[employee.gender] ?? "default";
              return <Tag color={color}>{employee.gender}</Tag>;
            })()}
          </Descriptions.Item>

          <Descriptions.Item label="Phone Number">
            {employee.phoneNumber}
          </Descriptions.Item>

          <Descriptions.Item label="Status">
            <Tag color={employee.active ? "green" : "red"}>
              {employee.active ? "Active" : "Inactive"}
            </Tag>
          </Descriptions.Item>

          <Descriptions.Item label="Created At">
            {dayjs(employee.createdAt).format("DD/MM/YYYY HH:mm:ss")}
          </Descriptions.Item>

          <Descriptions.Item label="Updated At">
            {dayjs(employee.updatedAt).format("DD/MM/YYYY HH:mm:ss")}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
};

export default EmployeeDetail;
