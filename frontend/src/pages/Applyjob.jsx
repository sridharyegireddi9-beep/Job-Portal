import React from "react";
import { Navigate, useParams } from "react-router-dom";

export default function ApplyJob() {
  const { id } = useParams();
  return <Navigate to={id ? `/jobs/${id}` : "/jobs"} replace />;
}
