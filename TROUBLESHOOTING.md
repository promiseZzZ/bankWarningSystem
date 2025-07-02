# API请求问题排查指南

## 问题描述
前端请求返回404，但Postman请求成功

## 可能的原因和解决方案

### 1. 代理配置问题 ✅ 已修复
**问题**: vite.config.ts中配置了代理，但请求路径不匹配
**解决方案**: 
- 将所有请求路径改为 `/api/offline/...`
- 代理会将 `/api` 前缀移除，转发到后端

### 2. 请求头问题
**检查项**:
- Content-Type是否正确
- Authorization头是否正确设置
- 是否有CORS问题

**解决方案**:
```typescript
// 检查请求头
const response = await axiosInstance.post('/api/offline/getProvince', data, {
  headers: {
    'Content-Type': 'application/json',
    'Authorization': token
  }
});
```

### 3. 请求方法问题
**检查项**:
- 确认后端期望的是POST还是GET
- 确认请求体格式是否正确

### 4. 网络连接问题
**检查项**:
- 后端服务是否正常运行
- 端口是否正确
- 防火墙设置

## 调试步骤

### 1. 检查控制台输出
打开浏览器开发者工具，查看Network标签页：
- 检查实际发送的请求URL
- 检查请求头
- 检查请求体
- 检查响应状态

### 2. 使用调试工具
系统已集成调试工具，会在控制台输出：
- 🚀 请求信息
- ✅ 响应成功信息
- ❌ 错误信息
- 🌐 网络连接状态
- 🔧 后端服务状态

### 3. 对比Postman请求
1. 在Postman中成功发送请求
2. 复制Postman的请求信息
3. 与前端请求进行对比：
   - URL是否一致
   - 请求方法是否一致
   - 请求头是否一致
   - 请求体是否一致

## 常见解决方案

### 方案1: 修改请求路径（已实施）
```typescript
// 修改前
const response = await axiosInstance.post('/offline/getProvince', data);

// 修改后
const response = await axiosInstance.post('/api/offline/getProvince', data);
```

### 方案2: 修改代理配置
```typescript
// vite.config.ts
export default defineConfig({
  server: {
    proxy: {
      '/offline': {  // 直接代理 /offline 路径
        target: 'http://172.20.10.3:8085',
        changeOrigin: true
      }
    }
  }
})
```

### 方案3: 使用完整URL
```typescript
// 直接使用后端地址
const response = await axios.post('http://172.20.10.3:8085/offline/getProvince', data);
```

## 验证步骤

1. **重启开发服务器**
   ```bash
   npm run dev
   ```

2. **清除浏览器缓存**
   - 按F12打开开发者工具
   - 右键刷新按钮，选择"清空缓存并硬性重新加载"

3. **检查网络请求**
   - 打开开发者工具Network标签
   - 刷新页面
   - 查看API请求的状态

4. **查看控制台输出**
   - 检查是否有调试信息
   - 检查是否有错误信息

## 如果问题仍然存在

1. **检查后端日志**
   - 查看后端服务器日志
   - 确认请求是否到达后端

2. **使用curl测试**
   ```bash
   curl -X POST http://172.20.10.3:8085/offline/getProvince \
     -H "Content-Type: application/json" \
     -d '{"transactionType":1,"aggDate":"2024-01-01","location":"全国"}'
   ```

3. **检查CORS配置**
   - 确认后端是否配置了CORS
   - 确认允许的域名和端口

4. **联系后端开发人员**
   - 提供详细的错误信息
   - 提供Postman成功的请求信息
   - 对比前端和Postman的差异 