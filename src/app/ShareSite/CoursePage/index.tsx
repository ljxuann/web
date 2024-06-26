import React from "react";
import { Button, Layout, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useUrl } from "../../../api/hooks/url";
import * as graphql from "@/generated/graphql";
import { ProColumns, ProTable } from "@ant-design/pro-components";
import { Link } from "react-router-dom";
import { PageProps } from "../..";
import DiscussDrawer from "./DiscussDrawer";
//import CourseRating from "./CourseRating";

export interface CourseProps extends PageProps {
  course_uuid: string;
}

const CoursesPage: React.FC<PageProps> = ({ mode, user }) => {
  const url = useUrl();
  const { refetch: courseRefetch } = graphql.useGetCourseSuspenseQuery();
  const columns: ProColumns<graphql.GetCourseQuery["course"][0]>[] = [
    {
      title: "课程号",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "课程名",
      dataIndex: "fullname",
      key: "fullname",
    },
    {
      title: "课程简称",
      dataIndex: "name",
      key: "name",
      hideInTable: true,
    },
    {
      title: "年份",
      dataIndex: "year",
      key: "year",
      filters: true,
      onFilter: true,
      // hideInSearch: true,
    },
    {
      title: "学期",
      dataIndex: "semester",
      key: "semester",
      filters: true,
      onFilter: true,
      // hideInSearch: true,
      valueType: "select",
      valueEnum: {
        spring: { text: "春季学期", status: "spring" },
        autumn: { text: "秋季学期", status: "autumn" },
        summer: { text: "夏季学期", status: "summer" },
      },
    },
    {
      title: "主讲教师",
      dataIndex: "professor",
      key: "professor",
    },
    {
      title: "课程属性",
      dataIndex: "type",
      key: "type",
      filters: true,
      onFilter: true,
      // hideInSearch: true,
      valueType: "select",
      valueEnum: {
        must: { text: "核心必修", status: "must" },
        required: { text: "专业限选", status: "required" },
        optional: { text: "专业任选", status: "optional" },
      },
    },
    {
      title: "授课语言",
      dataIndex: "language",
      key: "language",
      filters: true,
      onFilter: true,
      // hideInSearch: true,
      valueType: "select",
      valueEnum: {
        chinese: { text: "中文", status: "chinese" },
        english: { text: "英文", status: "english" },
      },
    },
    {
      title: "操作",
      valueType: "option",
      width: "20%",
      key: "option",
      render: (text, record, _, action) => [
        <DiscussDrawer course_uuid={record.uuid} mode={mode} user={user} />,
        <Link to={url.append("course", record.uuid).link("repo")}>仓库</Link>,
      ],
    },
  ];

  const dataRequest = async (params: {
    pageSize?: number;
    current?: number;
  }): Promise<{
    data: graphql.GetCourseQuery["course"];
    success: boolean;
    total?: number;
  }> => {
    console.log(params);
    const { data, error } = await courseRefetch();

    if (error) {
      message.error("课程加载失败");
      console.log(error.message);
      return {
        data: [],
        success: false,
        total: 0,
      };
    }
    return {
      data: data.course,
      success: true,
      total: data.course.length,
    };
  };

  return (
    <Layout
      css={`
        margin: 30px;
      `}
    >
      <ProTable<graphql.GetCourseQuery["course"][0]>
        columns={columns}
        request={dataRequest}
        rowKey="uuid"
        pagination={{
          showQuickJumper: true,
        }}
        search={{
          labelWidth: "auto",
        }}
        dateFormatter="string"
        headerTitle="课程列表"
        toolBarRender={() => [
          <Button key="button" icon={<PlusOutlined />} type="primary">
            导入
          </Button>,
        ]}
      />
    </Layout>
  );
};

export default CoursesPage;
