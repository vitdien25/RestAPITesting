import { useParams } from "react-router-dom";
import EmployeeForm from "../components/EmployeeForm";

const EditEmployeePage = () => {
  const { id } = useParams<{ id: string }>();
  const employeeId = parseInt(id || "0", 10);

  return <EmployeeForm employeeId={employeeId} isEdit />;
};

export default EditEmployeePage;
