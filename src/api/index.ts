import axios, { Method, AxiosRequestConfig } from "axios";

import { getUserInfo } from "@/util";
import errorHandle from "./errorHandle";
import baseUrl, { userUrl } from "./baseUrl";

export interface FetchApiProps<T = Record<string, unknown>> {
  apiPath: string;
  apiRoot?: string;
  method?: Method;
  params?: T;
  config?: Record<string, string>;
  headers?: Record<string, string>;
}

async function fetchApi(props: FetchApiProps) {
  const { apiPath, method = "get", params = {}, config, headers } = props;
  let requestUrl = baseUrl;

  if (apiPath.indexOf("/tUseRole/") === 0) {
    requestUrl = userUrl;
  }
  if (apiPath.indexOf("/tsysuser/") === 0) {
    requestUrl = userUrl;
  }
  if (props.apiRoot) {
    requestUrl = props.apiRoot;
  }

  const instance = {
    baseURL: requestUrl,
    timeout: 1000 * 60,
    withCredentials: true,
    headers: {
      UserId: getUserInfo().userId,
      ...headers,
    },
  };

  const options: AxiosRequestConfig = {
    url: apiPath,
    data: null,
    params: null,
    method,
    ...config,
  };

  if (["put", "post"].includes(method.toLocaleLowerCase())) {
    options.data = params;
  } else {
    options.params = params;
  }

  let result;
  try {
    result = await axios.create(instance)(options);
  } catch (error) {
    errorHandle(error);
    return Promise.reject(error);
  }
  if (result?.data.status !== 200) {
    errorHandle(result.data, { type: "warn", title: "提示信息" });
    return Promise.reject();
  }
  if (result?.data?.data === null) {
    result.data.data = {};
  }
  return Promise.resolve(result.data);
}

export default fetchApi;
