# 王者TI - 寻找你的本命英雄

> 25道灵魂拷问，唤醒你内心的王者

## 快速开始

```bash
cd 王者TI
npm install
npm run dev
```

打开 http://localhost:5173/

## 项目结构

```
王者TI/
├── index.html              # 主页面
├── package.json            # 项目配置
├── data/
│   └── questions.json      # 测试题目数据
├── hero_images/            # 英雄图片资源
└── src/
    ├── main.js             # 应用入口
    ├── quiz.js             # 答题流程控制
    ├── result.js           # 结果渲染
    └── style.css           # 样式主题
```

## 核心逻辑

1. **第一阶段（1-20题）**：MBTI基础测试，四维度各5题
2. **第二阶段（21-25题）**：根据MBTI结果选择对应3个英雄，5道专属题目匹配
3. **结果页**：展示最匹配的英雄海报和描述

## License

MIT
