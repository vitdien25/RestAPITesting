/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Form,
  Input,
  Select,
  DatePicker,
  Space,
  Typography,
} from "antd";
import { Save, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { extractFieldErrors, extractErrorMessage } from "../utils/error";
import { Alert } from "antd";
import { yupResolver } from "@hookform/resolvers/yup";
import dayjs from "dayjs";
import { Gender } from "../types/employee";
import {
  useCreateEmployee,
  useUpdateEmployee,
  useEmployee,
} from "../hooks/useEmployee";
import {
  employeeCreateSchema,
  employeeUpdateSchema,
} from "../utils/validations";
import type {
  EmployeeCreateFormData,
  EmployeeUpdateFormData,
} from "../utils/validations";

const { Title } = Typography;
const { Option } = Select;

interface EmployeeFormProps {
  employeeId?: number;
  isEdit?: boolean;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({
  employeeId,
  isEdit = false,
}) => {
  const navigate = useNavigate();
  const createEmployee = useCreateEmployee();
  const updateEmployee = useUpdateEmployee();
  const { data: employeeResponse } = useEmployee(employeeId || 0);

  const employee = employeeResponse?.data;

  const createForm = useForm<EmployeeCreateFormData>({
    resolver: yupResolver(employeeCreateSchema),
    defaultValues: {
      fullName: "",
      email: "",
      dateOfBirth: "",
      gender: Gender.MALE,
      phoneNumber: "",
      password: "",
    },
  });

  const editForm = useForm<EmployeeUpdateFormData>({
    resolver: yupResolver(employeeUpdateSchema) as any,
    defaultValues: {},
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = isEdit ? editForm : createForm;

  const [globalErrors, setGlobalErrors] = useState<string[]>([]);

  useEffect(() => {
    if (isEdit && employee) {
      const form = editForm;
      form.setValue("fullName", employee.fullName);
      form.setValue("dateOfBirth", employee.dateOfBirth);
      form.setValue("gender", employee.gender);
      form.setValue("phoneNumber", employee.phoneNumber);
    }
  }, [employee, isEdit, editForm]);

  const onSubmit = (data: EmployeeCreateFormData | EmployeeUpdateFormData) => {
    if (isEdit && employeeId) {
      updateEmployee.mutate(
        { id: employeeId, data: data as EmployeeUpdateFormData },
        {
          onSuccess: () => {
            navigate("/");
          },
          onError: (err) => {
            setGlobalErrors([]);
            const fieldErrs = extractFieldErrors(err);
            const global = fieldErrs._global || [];
            setGlobalErrors(global);
            Object.keys(fieldErrs).forEach((k) => {
              if (k === "_global") return;
              const msgs = fieldErrs[k];
              setError(k as any, { type: "server", message: msgs.join("; ") });
            });
            const msg = extractErrorMessage(err);
            if (global.length === 0 && msg) setGlobalErrors([msg]);
          },
        }
      );
    } else {
      createEmployee.mutate(data as EmployeeCreateFormData, {
        onSuccess: () => {
          reset();
          navigate("/");
        },
        onError: (err) => {
          setGlobalErrors([]);
          const fieldErrs = extractFieldErrors(err);
          const global = fieldErrs._global || [];
          setGlobalErrors(global);
          Object.keys(fieldErrs).forEach((k) => {
            if (k === "_global") return;
            const msgs = fieldErrs[k];
            setError(k as any, { type: "server", message: msgs.join("; ") });
          });
          const msg = extractErrorMessage(err);
          if (global.length === 0 && msg) setGlobalErrors([msg]);
        },
      });
    }
  };

  const handleCancel = () => {
    navigate("/");
  };

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
          {isEdit ? "Edit Employee" : "Create Employee"}
        </Title>
        <Button icon={<ArrowLeft size={20} />} onClick={handleCancel}>
          Back to List
        </Button>
      </div>

      <Card>
        {globalErrors.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <Alert
              type="error"
              message={globalErrors.join("; ")}
              showIcon
              closable
            />
          </div>
        )}
        <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "16px",
            }}
          >
            <Form.Item
              label="Full Name"
              validateStatus={errors.fullName ? "error" : ""}
              help={errors.fullName?.message}
              required={!isEdit}
            >
              <Controller
                name="fullName"
                control={control as any}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Enter full name"
                    size="large"
                  />
                )}
              />
            </Form.Item>

            {!isEdit && (
              <Form.Item
                label="Email"
                validateStatus={(errors as any).email ? "error" : ""}
                help={(errors as any).email?.message}
                required
              >
                <Controller
                  name="email"
                  control={control as any}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="email"
                      placeholder="Enter email address"
                      size="large"
                    />
                  )}
                />
              </Form.Item>
            )}

            <Form.Item
              label="Date of Birth"
              validateStatus={errors.dateOfBirth ? "error" : ""}
              help={errors.dateOfBirth?.message}
              required={!isEdit}
            >
              <Controller
                name="dateOfBirth"
                control={control as any}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    value={field.value ? dayjs(field.value) : null}
                    onChange={(date) =>
                      field.onChange(date?.format("YYYY-MM-DD"))
                    }
                    placeholder="Select date of birth"
                    size="large"
                    style={{ width: "100%" }}
                    format="DD/MM/YYYY"
                  />
                )}
              />
            </Form.Item>

            <Form.Item
              label="Gender"
              validateStatus={errors.gender ? "error" : ""}
              help={errors.gender?.message}
              required={!isEdit}
            >
              <Controller
                name="gender"
                control={control as any}
                render={({ field }) => (
                  <Select {...field} placeholder="Select gender" size="large">
                    <Option value={Gender.MALE}>Male</Option>
                    <Option value={Gender.FEMALE}>Female</Option>
                    <Option value={Gender.OTHER}>Other</Option>
                  </Select>
                )}
              />
            </Form.Item>

            <Form.Item
              label="Phone Number"
              validateStatus={errors.phoneNumber ? "error" : ""}
              help={errors.phoneNumber?.message}
              required={!isEdit}
            >
              <Controller
                name="phoneNumber"
                control={control as any}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Enter phone number"
                    size="large"
                  />
                )}
              />
            </Form.Item>

            {!isEdit && (
              <Form.Item
                label="Password"
                validateStatus={(errors as any).password ? "error" : ""}
                help={(errors as any).password?.message}
                required
              >
                <Controller
                  name="password"
                  control={control as any}
                  render={({ field }) => (
                    <Input.Password
                      {...field}
                      placeholder="Enter password"
                      size="large"
                    />
                  )}
                />
              </Form.Item>
            )}
          </div>

          <Form.Item style={{ marginTop: 24 }}>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                icon={<Save size={20} />}
                loading={
                  isEdit ? updateEmployee.isPending : createEmployee.isPending
                }
              >
                {isEdit ? "Update Employee" : "Create Employee"}
              </Button>
              <Button size="large" onClick={handleCancel}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default EmployeeForm;
