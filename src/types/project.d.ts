import type { Commit } from './commit';

export interface Project {
  id: number;
  description: string; // 描述
  name: string; // 项目名称
  name_with_namespace: string; // 带空间的名字
  last_activity_at: string; // 更新时间
  commits: Commit[];
}
