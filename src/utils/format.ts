export function formatNumber(num: number): string {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万';
  }
  return num.toString();
}

export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function getRoleName(role: string): string {
  const roleMap: Record<string, string> = {
    first: '一辩',
    second: '二辩',
    third: '三辩',
    fourth: '四辩',
  };
  return roleMap[role] || role;
}

export function getSideName(side: string): string {
  return side === 'affirmative' ? '正方' : '反方';
}

export function getSideColor(side: string, asBgClass: boolean = false): string {
  if (asBgClass) {
    return side === 'affirmative' ? 'bg-[#c41e3a]' : 'bg-[#0d7377]';
  }
  return side === 'affirmative' ? '#c41e3a' : '#0d7377';
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  if (mins > 0) {
    return `${mins}分${secs}秒`;
  }
  return `${secs}秒`;
}

export function formatDateTime(date: Date): string {
  const d = new Date(date);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) return '刚刚';
  if (minutes < 60) return `${minutes}分钟前`;
  if (hours < 24) return `${hours}小时前`;
  if (days < 7) return `${days}天前`;
  
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export function formatDate(date: Date): string {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function getViolationTypeName(type: string): string {
  const typeMap: Record<string, string> = {
    timeout: '超时',
    interruption: '打断',
    interrupt: '打断',
    personal_attack: '人身攻击',
    off_topic: '跑题',
    other: '其他',
  };
  return typeMap[type] || type;
}

export function getStatusText(status: string): string {
  const statusMap: Record<string, string> = {
    preparing: '准备中',
    ongoing: '进行中',
    finished: '已结束',
  };
  return statusMap[status] || status;
}

export function getStatusColor(status: string): string {
  const colorMap: Record<string, string> = {
    preparing: 'bg-yellow-500',
    ongoing: 'bg-green-500',
    finished: 'bg-gray-500',
  };
  return colorMap[status] || 'bg-gray-500';
}



export function getArgumentTypeName(type: string): string {
  const typeMap: Record<string, string> = {
    argument: '论点',
    evidence: '论据',
    rebuttal: '反驳',
  };
  return typeMap[type] || type;
}

export function getArgumentTypeColor(type: string): string {
  const colorMap: Record<string, string> = {
    argument: 'border-blue-500 bg-blue-500/10',
    evidence: 'border-green-500 bg-green-500/10',
    rebuttal: 'border-orange-500 bg-orange-500/10',
  };
  return colorMap[type] || 'border-gray-500 bg-gray-500/10';
}
