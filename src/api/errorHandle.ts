import { notification as AntNotification } from "ant-design-vue";

export interface ErrorInfo {
  response?: Response;
  message?: string;
  msg?: string;
  status?: string;
}

interface Response {
  data: BodyNode;
  statusText: string;
}
interface BodyNode {
  [x: string]: string;
}

type ConfigProps = {
  title?: string;
  type?: "warn" | "error" | "info";
  duration?: number;
};
const errorHandle = (error: ErrorInfo, config: ConfigProps = {}): void => {
  const { title, duration, type = "error" } = config;
  const { response, message, msg } = error;
  const isTimeout = message?.indexOf("timeout of") === 0;
  AntNotification.destroy();
  AntNotification[type]({
    message: title || response?.statusText || "服务开小差了...",
    duration: duration || 2,
    description: (!isTimeout && (message || msg || response?.data?.msg)) || "",
  });
};

export default errorHandle;
