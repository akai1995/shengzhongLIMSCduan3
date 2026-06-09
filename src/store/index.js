import { createStore } from 'vuex'

const store = createStore({
  state: {
    user: {
      name: '张三',
      avatar: '',
      department: '科研部',
      position: '研究员'
    },
    todoCount: 5,
    warningCount: 3,
    learningCount: 2,
    statistics: {
      devices: 128,
      supplies: 356,
      projects: 24,
      experiments: 89
    },
    notifications: [
      { id: 1, type: 'system', title: '系统维护通知', content: '系统将于今晚22:00-00:00进行例行维护，请提前保存数据', time: '10分钟前', read: false, priority: 'high' },
      { id: 2, type: 'warning', title: '温湿度警报', content: '实验室A101温湿度超出安全范围，请及时处理', time: '30分钟前', read: false, priority: 'high', location: '实验室A101' },
      { id: 3, type: 'approval', title: '审批通过', content: '您的「医学影像AI」项目申请已通过审批', time: '1小时前', read: true, relatedProject: '医学影像AI' },
      { id: 4, type: 'supply', title: '耗材库存预警', content: '一次性手套库存不足20盒，请及时补充', time: '2小时前', read: false, priority: 'medium', supplyName: '一次性手套', stock: 15 },
      { id: 5, type: 'device', title: '设备维护提醒', content: 'PCR仪#AB-9700需要进行定期维护保养', time: '3小时前', read: true, deviceName: 'PCR仪', deviceModel: 'AB-9700' },
      { id: 6, type: 'learning', title: '培训待完成', content: '您有2项培训课程待完成，请尽快学习', time: '4小时前', read: false, priority: 'medium', count: 2 },
      { id: 7, type: 'experiment', title: '实验记录提醒', content: '您有3条实验记录待审核确认', time: '5小时前', read: false, count: 3 },
      { id: 8, type: 'approval', title: '审批待处理', content: '您有1条审批申请待处理', time: '6小时前', read: false, priority: 'high', count: 1 },
      { id: 9, type: 'system', title: '新功能上线', content: 'AI生成记录功能已正式上线，欢迎体验', time: '昨天', read: true },
      { id: 10, type: 'project', title: '项目里程碑', content: '「基因测序平台」项目进度已达80%', time: '昨天', read: true, relatedProject: '基因测序平台', progress: 80 }
    ],
    projects: [
      { 
        id: 1, 
        name: '医学影像AI', 
        status: '进行中', 
        progress: 65, 
        budget: 500000, 
        spent: 320000,
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        leader: '李明',
        description: '基于深度学习的医学影像自动诊断系统研究',
        milestones: [
          { id: 1, name: '需求分析', status: '已完成', date: '2024-01-15' },
          { id: 2, name: '数据采集', status: '已完成', date: '2024-02-20' },
          { id: 3, name: '模型训练', status: '进行中', date: '2024-03-01' },
          { id: 4, name: '系统集成', status: '未开始', date: '2024-06-01' },
          { id: 5, name: '测试验收', status: '未开始', date: '2024-10-01' }
        ],
        members: [
          { id: 1, name: '李明', role: '项目负责人', department: '科研部', avatar: '李' },
          { id: 2, name: '王芳', role: '算法工程师', department: '研发部', avatar: '王' },
          { id: 3, name: '张伟', role: '数据分析师', department: '数据部', avatar: '张' },
          { id: 4, name: '陈静', role: '测试工程师', department: '测试部', avatar: '陈' }
        ],
        results: [
          { id: 1, type: '论文', title: '基于CNN的医学影像分类研究', status: '已发表', date: '2024-03-15', journal: '医学人工智能杂志' },
          { id: 2, type: '专利', title: '一种医学影像诊断方法及系统', status: '审核中', date: '2024-02-01' },
          { id: 3, type: '软著', title: '医学影像AI诊断平台V1.0', status: '已登记', date: '2024-04-20' }
        ]
      },
      { 
        id: 2, 
        name: '新药研发', 
        status: '未开始', 
        progress: 0, 
        budget: 800000, 
        spent: 0,
        startDate: '2024-06-01',
        endDate: '2025-12-31',
        leader: '王芳',
        description: '新型靶向药物的研发与临床前研究',
        milestones: [
          { id: 1, name: '立项准备', status: '进行中', date: '2024-05-01' },
          { id: 2, name: '化合物筛选', status: '未开始', date: '2024-07-01' },
          { id: 3, name: '药效学研究', status: '未开始', date: '2024-10-01' },
          { id: 4, name: '安全性评价', status: '未开始', date: '2025-03-01' },
          { id: 5, name: '临床前研究', status: '未开始', date: '2025-09-01' }
        ],
        members: [
          { id: 1, name: '王芳', role: '项目负责人', department: '研发部', avatar: '王' },
          { id: 2, name: '刘强', role: '药理学专家', department: '药理部', avatar: '刘' }
        ],
        results: []
      },
      { 
        id: 3, 
        name: '基因测序平台', 
        status: '进行中', 
        progress: 80, 
        budget: 300000, 
        spent: 280000,
        startDate: '2023-06-01',
        endDate: '2024-06-30',
        leader: '张伟',
        description: '高通量基因测序数据分析平台建设',
        milestones: [
          { id: 1, name: '平台架构设计', status: '已完成', date: '2023-07-01' },
          { id: 2, name: '数据处理流程开发', status: '已完成', date: '2023-10-01' },
          { id: 3, name: '可视化模块开发', status: '已完成', date: '2024-01-15' },
          { id: 4, name: '系统联调测试', status: '进行中', date: '2024-03-01' },
          { id: 5, name: '试运行与验收', status: '未开始', date: '2024-05-01' }
        ],
        members: [
          { id: 1, name: '张伟', role: '项目负责人', department: '数据部', avatar: '张' },
          { id: 2, name: '周婷', role: '生信工程师', department: '数据部', avatar: '周' },
          { id: 3, name: '吴刚', role: '运维工程师', department: '技术部', avatar: '吴' }
        ],
        results: [
          { id: 1, type: '论文', title: '大规模基因组数据分析方法研究', status: '已发表', date: '2024-01-10', journal: '生物信息学前沿' },
          { id: 2, type: '软著', title: '基因测序数据分析系统V2.0', status: '已登记', date: '2024-02-28' }
        ]
      },
      { 
        id: 4, 
        name: '生物信息学研究', 
        status: '已完成', 
        progress: 100, 
        budget: 200000, 
        spent: 195000,
        startDate: '2023-01-01',
        endDate: '2023-12-31',
        leader: '陈静',
        description: '蛋白质结构预测与功能分析研究',
        milestones: [
          { id: 1, name: '文献调研', status: '已完成', date: '2023-02-01' },
          { id: 2, name: '数据分析', status: '已完成', date: '2023-06-01' },
          { id: 3, name: '模型构建', status: '已完成', date: '2023-09-01' },
          { id: 4, name: '论文撰写', status: '已完成', date: '2023-11-01' },
          { id: 5, name: '项目验收', status: '已完成', date: '2023-12-31' }
        ],
        members: [
          { id: 1, name: '陈静', role: '项目负责人', department: '科研部', avatar: '陈' },
          { id: 2, name: '郑华', role: '生物信息学专家', department: '科研部', avatar: '郑' }
        ],
        results: [
          { id: 1, type: '论文', title: '基于深度学习的蛋白质结构预测', status: '已发表', date: '2023-11-15', journal: '自然计算科学' },
          { id: 2, type: '专利', title: '一种蛋白质功能预测方法', status: '已授权', date: '2023-12-01' },
          { id: 3, type: '软著', title: '蛋白质分析工具箱V1.0', status: '已登记', date: '2023-10-20' },
          { id: 4, type: '奖项', title: '年度优秀科研成果奖', status: '已获得', date: '2024-01-05' }
        ]
      }
    ],
    devices: [
      { id: 1, name: 'MRI扫描仪', status: '运行中', location: '实验室A101', lastUpdate: '刚刚' },
      { id: 2, name: '基因测序仪', status: '在线', location: '实验室B201', lastUpdate: '5分钟前' },
      { id: 3, name: '质谱仪', status: '故障', location: '实验室C301', lastUpdate: '1小时前' },
      { id: 4, name: 'PCR仪', status: '离线', location: '实验室A102', lastUpdate: '2小时前' }
    ],
    approvals: [
      { id: 1, title: '设备采购', description: 'PCR仪采购申请', applicant: '李明', department: '实验室A', time: '2024-01-15', type: 'equipment' },
      { id: 2, title: '耗材申请', description: '培养基采购', applicant: '王芳', department: '实验室B', time: '2024-01-15', type: 'supply' },
      { id: 3, title: '实验预约', description: 'MRI扫描仪预约', applicant: '张伟', department: '实验室C', time: '2024-01-14', type: 'reservation' },
      { id: 4, title: '危化品申请', description: '丙酮试剂', applicant: '陈静', department: '实验室D', time: '2024-01-14', type: 'hazardous' },
      { id: 5, title: '项目变更', description: '预算调整', applicant: '刘强', department: '实验室E', time: '2024-01-14', type: 'project' },
      { id: 6, title: '设备采购', description: '离心机采购申请', applicant: '赵琳', department: '实验室A', time: '2024-01-13', type: 'equipment' },
      { id: 7, title: '耗材申请', description: '试剂采购', applicant: '孙磊', department: '实验室B', time: '2024-01-13', type: 'supply' },
      { id: 8, title: '实验预约', description: '质谱仪预约', applicant: '周婷', department: '实验室C', time: '2024-01-12', type: 'reservation' },
      { id: 9, title: '危化品申请', description: '乙醇采购', applicant: '吴刚', department: '实验室D', time: '2024-01-12', type: 'hazardous' },
      { id: 10, title: '项目变更', description: '研究方向调整', applicant: '郑华', department: '实验室E', time: '2024-01-11', type: 'project' }
    ],
    warnings: [
      { id: 1, title: '温度警报', description: '温度过高', location: '实验室C301', level: 'danger', time: '5分钟前' },
      { id: 2, title: '湿度警报', description: '湿度过高', location: '库房B区', level: 'warning', time: '10分钟前' },
      { id: 3, title: '库存不足', description: '耗材库存偏低', location: '货架A01', level: 'warning', time: '30分钟前' },
      { id: 4, title: '设备故障', description: '设备停机', location: '实验室C301', level: 'danger', time: '1小时前' },
      { id: 5, title: '门禁异常', description: '门禁多次刷卡失败', location: '大楼入口', level: 'danger', time: '2小时前' },
      { id: 6, title: '通风告警', description: '通风系统异常', location: '实验室A101', level: 'warning', time: '3小时前' },
      { id: 7, title: '压力异常', description: '气压超出安全范围', location: '气瓶间', level: 'danger', time: '4小时前' },
      { id: 8, title: '电量不足', description: 'UPS电量低于20%', location: '机房', level: 'warning', time: '5小时前' },
      { id: 9, title: '网络中断', description: '网络连接异常', location: '实验室B区', level: 'warning', time: '6小时前' },
      { id: 10, title: '消防预警', description: '烟雾探测器触发', location: '仓库', level: 'danger', time: '昨天' }
    ],
    learnings: [
      { id: 1, title: '安全培训', description: '实验室安全操作规程与应急处理', deadline: '2024-01-20', progress: 60, type: 'learning' },
      { id: 2, title: '知识考核', description: 'Q1季度安全知识测试', deadline: '2024-01-25', progress: 0, type: 'learning' },
      { id: 3, title: '设备培训', description: 'MRI扫描仪操作培训课程', deadline: '2024-02-01', progress: 30, type: 'learning' },
      { id: 4, title: '数据安全', description: '科研数据保护与隐私合规培训', deadline: '2024-02-10', progress: 0, type: 'learning' },
      { id: 5, title: '实验规范', description: 'PCR实验操作规范培训', deadline: '2024-02-15', progress: 80, type: 'learning' },
      { id: 6, title: '合规考试', description: '实验室管理规范考核', deadline: '2024-02-20', progress: 0, type: 'learning' }
    ],
    supplies: [
      { id: 1, name: '一次性手套', category: '防护用品', unit: '盒', stock: 150, location: '货架A01', icon: '🧤', warningThreshold: 20 },
      { id: 2, name: '离心管', category: '实验耗材', unit: '包', stock: 85, location: '货架A02', icon: '🧪', warningThreshold: 30 },
      { id: 3, name: '培养基', category: '试剂类', unit: '瓶', stock: 42, location: '货架B01', icon: '🧫', warningThreshold: 10 },
      { id: 4, name: '移液枪头', category: '实验耗材', unit: '盒', stock: 120, location: '货架A03', icon: '💉', warningThreshold: 50 },
      { id: 5, name: '滤纸', category: '实验耗材', unit: '包', stock: 68, location: '货架A04', icon: '📄', warningThreshold: 20 },
      { id: 6, name: '酒精', category: '试剂类', unit: '瓶', stock: 35, location: '货架B02', icon: '🧴', warningThreshold: 15 },
      { id: 7, name: '口罩', category: '防护用品', unit: '盒', stock: 200, location: '货架A05', icon: '😷', warningThreshold: 30 },
      { id: 8, name: '培养皿', category: '实验耗材', unit: '包', stock: 56, location: '货架A06', icon: '🥽', warningThreshold: 20 },
      { id: 9, name: 'PBS缓冲液', category: '试剂类', unit: '瓶', stock: 28, location: '货架B03', icon: '💧', warningThreshold: 10 },
      { id: 10, name: '标签纸', category: '办公用品', unit: '卷', stock: 45, location: '货架C01', icon: '🏷️', warningThreshold: 15 },
      { id: 11, name: '实验记录本', category: '办公用品', unit: '本', stock: 80, location: '货架C02', icon: '📒', warningThreshold: 20 },
      { id: 12, name: '注射器', category: '实验耗材', unit: '支', stock: 320, location: '货架A07', icon: '💉', warningThreshold: 100 }
    ],
    supplyRecords: [
      { id: 1, supplyId: 1, supplyName: '一次性手套', quantity: 5, unit: '盒', applicant: '张三', department: '科研部', project: '医学影像AI', purpose: '实验操作防护', status: '已领取', time: '2024-01-15 09:30' },
      { id: 2, supplyId: 3, supplyName: '培养基', quantity: 2, unit: '瓶', applicant: '张三', department: '科研部', project: '新药研发', purpose: '细胞培养实验', status: '已领取', time: '2024-01-14 14:20' },
      { id: 3, supplyId: 4, supplyName: '移液枪头', quantity: 3, unit: '盒', applicant: '张三', department: '科研部', project: '基因测序平台', purpose: 'DNA提取实验', status: '待领取', time: '2024-01-16 10:00' }
    ],
    aiRecords: [
      { 
        id: 1, 
        type: 'report',
        title: '实验数据分析报告', 
        project: '医学影像AI',
        description: '基于MRI影像数据的特征提取与分类分析报告，包含深度学习模型训练结果和性能评估指标。',
        status: 'completed',
        wordCount: 2856,
        time: '2024-01-16 15:30',
        keywords: ['MRI', '深度学习', '影像分析'],
        usage: '已用于项目周报'
      },
      { 
        id: 2, 
        type: 'summary',
        title: '文献综述摘要', 
        project: '新药研发',
        description: '关于靶向药物研发最新进展的文献综述，涵盖50余篇核心文献的系统性总结。',
        status: 'completed',
        wordCount: 1523,
        time: '2024-01-15 10:20',
        keywords: ['靶向药物', '文献综述', '研发进展'],
        usage: '已引用到开题报告'
      },
      { 
        id: 3, 
        type: 'protocol',
        title: 'PCR实验方案建议', 
        project: '基因测序平台',
        description: '针对DNA扩增实验的优化方案建议，包括引物设计、反应条件优化和质控指标建议。',
        status: 'completed',
        wordCount: 892,
        time: '2024-01-14 16:45',
        keywords: ['PCR', '引物设计', '实验优化'],
        usage: '已应用于实验'
      },
      { 
        id: 4, 
        type: 'analysis',
        title: 'RNA-seq数据分析报告', 
        project: '生物信息学研究',
        description: '转录组测序数据分析结果报告，包含差异表达基因分析、GO富集分析和通路分析结果。',
        status: 'completed',
        wordCount: 4120,
        time: '2024-01-13 09:15',
        keywords: ['RNA-seq', '差异表达', '生物信息学'],
        usage: '已用于论文写作'
      },
      { 
        id: 5, 
        type: 'report',
        title: '实验数据可视化描述', 
        project: '医学影像AI',
        description: '实验数据可视化图表生成与解读，包含数据分布、相关性分析和趋势预测可视化。',
        status: 'processing',
        wordCount: 0,
        time: '2024-01-16 17:00',
        keywords: ['数据可视化', '图表生成', '趋势分析'],
        usage: ''
      }
    ],
    aiTemplates: [
      { id: 1, name: '实验报告生成', icon: '📝', description: '根据实验数据自动生成完整的实验报告' },
      { id: 2, name: '文献摘要', icon: '📚', description: '自动生成学术文献的摘要和关键点总结' },
      { id: 3, name: '实验方案', icon: '🧪', description: '根据实验目标生成详细的实验方案建议' },
      { id: 4, name: '数据分析', icon: '📊', description: '分析实验数据并生成可视化报告' },
      { id: 5, name: '论文润色', icon: '✍️', description: '学术论文语言润色和格式优化' },
      { id: 6, name: '数据解读', icon: '🔍', description: '解读实验数据并生成专业分析报告' },
      { id: 7, name: '图表生成', icon: '📈', description: '根据数据生成专业图表和可视化分析' },
      { id: 8, name: '参考文献', icon: '📖', description: '自动生成参考文献格式和引用规范' },
      { id: 9, name: '项目计划书', icon: '📋', description: '生成科研项目立项书和计划书' },
      { id: 10, name: '实验记录', icon: '📓', description: '自动生成规范化实验记录内容' }
    ]
  },
  getters: {
    user: state => state.user,
    todoCount: state => state.todoCount,
    warningCount: state => state.warningCount,
    learningCount: state => state.learningCount,
    statistics: state => state.statistics,
    notifications: state => state.notifications,
    projects: state => state.projects,
    devices: state => state.devices,
    approvals: state => state.approvals,
    warnings: state => state.warnings,
    learnings: state => state.learnings,
    supplies: state => state.supplies,
    supplyRecords: state => state.supplyRecords,
    aiRecords: state => state.aiRecords,
    aiTemplates: state => state.aiTemplates
  },
  mutations: {
    UPDATE_SUPPLY_STOCK(state, { supplyId, quantity }) {
      const supply = state.supplies.find(s => s.id === supplyId)
      if (supply) {
        supply.stock -= quantity
      }
    },
    ADD_SUPPLY_RECORD(state, record) {
      state.supplyRecords.unshift(record)
    },
    UPDATE_SUPPLY_RECORD_STATUS(state, { recordId, status }) {
      const record = state.supplyRecords.find(r => r.id === recordId)
      if (record) {
        record.status = status
      }
    },
    ADD_AI_RECORD(state, record) {
      state.aiRecords.unshift(record)
    },
    UPDATE_AI_RECORD_STATUS(state, { recordId, status }) {
      const record = state.aiRecords.find(r => r.id === recordId)
      if (record) {
        record.status = status
      }
    }
  }
})

export default store