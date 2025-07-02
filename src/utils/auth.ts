// Token管理工具

/**
 * 获取token
 * @returns token字符串，如果不存在则返回空字符串
 */
export const getToken = (): string => {
  // 优先从localStorage获取
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  if (!token) {
    console.warn('未找到token，请先登录');
    return '';
  }
  return token;
};

/**
 * 设置token
 * @param token token字符串
 * @param remember 是否记住登录状态（决定存储到localStorage还是sessionStorage）
 */
export const setToken = (token: string, remember: boolean = false): void => {
  if (remember) {
    localStorage.setItem('token', token);
  } else {
    sessionStorage.setItem('token', token);
  }
};

/**
 * 清除token
 */
export const clearToken = (): void => {
  localStorage.removeItem('token');
  sessionStorage.removeItem('token');
};

/**
 * 检查是否有token
 * @returns 是否有有效的token
 */
export const hasToken = (): boolean => {
  return !!(localStorage.getItem('token') || sessionStorage.getItem('token'));
};

/**
 * 获取token并验证
 * @returns 验证后的token，如果无效则返回空字符串
 */
export const getValidToken = (): string => {
  const token = getToken();
  if (!token) {
    return '';
  }
  
  // 这里可以添加token有效性验证逻辑
  // 例如检查token是否过期等
  
  return token;
}; 