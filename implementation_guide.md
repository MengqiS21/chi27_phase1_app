# 实施指南：CHI'27 实验平台搭建

## 概览

本文档引导你从零开始完成实验平台的搭建、部署和数据收集全流程。

---

## 第一步：本地环境准备

### 1.1 创建项目文件夹

```bash
mkdir experiment_app
cd experiment_app
```

### 1.2 创建虚拟环境

```bash
python -m venv venv
source venv/bin/activate       # Mac/Linux
# 或 venv\Scripts\activate    # Windows
```

### 1.3 安装依赖

创建 `requirements.txt`：

```
streamlit
supabase
anthropic
python-dotenv
```

然后安装：

```bash
pip install -r requirements.txt
```

---

## 第二步：配置 Supabase

### 2.1 创建账号和项目

1. 前往 [supabase.com](https://supabase.com) 注册免费账号
2. 点击 **New Project**，填写项目名称（如 `chi27-experiment`），设置数据库密码，选择离你最近的 Region
3. 等待项目初始化（约1分钟）

### 2.2 创建数据库表

1. 在左侧菜单点击 **SQL Editor**
2. 将以下SQL全部粘贴进去，点击 **Run**：

```sql
CREATE TABLE participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  access_code TEXT,
  latin_square_row INTEGER,
  scenario_order JSONB,
  condition_order JSONB,
  age TEXT,
  gender TEXT,
  prior_ai_use TEXT,
  ss_1 INTEGER, ss_2 INTEGER, ss_3 INTEGER,
  ai_1 INTEGER, ai_2 INTEGER, ai_3 INTEGER,
  dc_1 INTEGER, dc_2 INTEGER, dc_3 INTEGER,
  current_scenario_index INTEGER DEFAULT 0,
  stage TEXT DEFAULT 'landing',
  started_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ
);

CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_id UUID REFERENCES participants(id),
  scenario_index INTEGER,
  scenario_type TEXT,
  condition TEXT,
  turn_index INTEGER,
  role TEXT,
  content TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE scenario_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_id UUID REFERENCES participants(id),
  scenario_index INTEGER,
  scenario_type TEXT,
  condition TEXT,
  dg_1 INTEGER, dg_2 INTEGER, dg_3 INTEGER, dg_4 INTEGER,
  bi_follow INTEGER, bi_retry INTEGER, bi_switch INTEGER, bi_alone INTEGER,
  med_understanding INTEGER, med_agency INTEGER, med_refusal INTEGER,
  submitted_at TIMESTAMPTZ DEFAULT now()
);
```

### 2.3 获取 API 密钥

1. 在左侧菜单点击 **Project Settings → API**
2. 复制以下两个值：
   - **Project URL**（形如 `https://xxxx.supabase.co`）
   - **anon / public key**（长字符串）

---

## 第三步：配置 Anthropic API Key

1. 前往 [console.anthropic.com](https://console.anthropic.com)，登录账号
2. 点击 **API Keys → Create Key**，复制生成的 key

---

## 第四步：本地配置环境变量

在项目根目录创建 `.env` 文件：

```
SUPABASE_URL=https://你的项目ID.supabase.co
SUPABASE_KEY=你的anon_key
ANTHROPIC_API_KEY=sk-ant-你的key
```

**重要：将 `.env` 加入 `.gitignore`，不要上传到 GitHub。**

```bash
echo ".env" >> .gitignore
```

---

## 第五步：用 Cursor 生成代码

1. 用 Cursor 打开项目文件夹
2. 打开 Cursor 的 Chat 面板（Cmd+L）
3. 将 `cursor_prompt.md` 的全部内容粘贴进去，发送
4. Cursor 会生成所有文件，逐个确认并保存

### 生成后检查

- [ ] `app.py` 存在且有页面路由逻辑
- [ ] `utils/db.py` 中有 `create_participant()`、`save_message()` 等函数
- [ ] `utils/ai.py` 中有调用 Claude API 的函数
- [ ] `content/` 文件夹下有 placeholder 内容
- [ ] `pages/` 下有所有页面文件

---

## 第六步：本地测试

### 6.1 启动应用

```bash
streamlit run app.py
```

浏览器会自动打开 `http://localhost:8501`

### 6.2 测试核查清单

**流程测试：**
- [ ] 输入错误 access code → 拒绝进入
- [ ] 输入正确 access code → 进入 consent
- [ ] 完成 consent → 进入 pre-survey
- [ ] 完成 pre-survey → 进入第1个 scenario
- [ ] 发送3条消息 → AI 触发拒绝
- [ ] 拒绝后聊天框消失，出现 "Continue" 按钮
- [ ] 完成 post-survey → 进入第2个 scenario
- [ ] 4个 scenario 全部完成 → 进入 debrief

**数据测试（在 Supabase 查看）：**
- [ ] `participants` 表有新记录，`stage` 字段随流程更新
- [ ] `conversations` 表每条消息都有记录
- [ ] `scenario_responses` 表每个 scenario 完成后有记录

**实验逻辑测试：**
- [ ] 跑4个不同的测试参与者，检查 `latin_square_row` 是否为 0、1、2、3
- [ ] 检查 `condition_order` 和 `scenario_order` 是否按 Latin Square 正确分配

---

## 第七步：填入正式实验内容

在正式数据收集前，修改 `content/` 文件夹：

### 7.1 `content/scenarios.py`
将4个 scenario 的文字替换为你最终定稿的版本。

### 7.2 `content/system_prompts.py`
将4个 condition 的 system prompt 替换为你定稿的版本。

**测试方法：** 用每个 condition 各跑一次完整对话，确认 AI 在第3轮触发拒绝，且拒绝方式符合预期。

### 7.3 `content/consent_text.py`
填入 IRB 审批通过的知情同意书文本。

### 7.4 `content/access_codes.py`
设置正式招募用的 access code。建议多设几个用于追踪来源：

```python
VALID_CODES = {
    "LAB2026",      # 发给 lab 成员用于 pilot
    "CHI2026A",     # 正式招募渠道 A
    "CHI2026B",     # 正式招募渠道 B
}
```

---

## 第八步：部署到公开网址（Streamlit Cloud）

### 8.1 上传到 GitHub

```bash
git init
git add .
git commit -m "initial experiment platform"
git remote add origin https://github.com/你的用户名/chi27-experiment.git
git push -u origin main
```

确认 `.env` 不在其中（用 `git status` 检查）。

### 8.2 部署到 Streamlit Cloud

1. 前往 [share.streamlit.io](https://share.streamlit.io)，用 GitHub 登录
2. 点击 **New app**，选择你的 repo 和 `app.py`
3. 点击 **Advanced settings → Secrets**，填入环境变量：

```toml
SUPABASE_URL = "https://你的项目ID.supabase.co"
SUPABASE_KEY = "你的anon_key"
ANTHROPIC_API_KEY = "sk-ant-你的key"
```

4. 点击 **Deploy**，等待部署完成（约2-3分钟）
5. 部署完成后你会得到一个公开链接，形如：`https://你的app名.streamlit.app`

---

## 第九步：Pilot 测试

正式数据收集前，招募 **5-8 名** pilot 参与者（lab 成员即可）：

- 给他们发 pilot 专用 access code（如 `LAB2026`）
- 收集完后在 Supabase 检查数据完整性
- 计算各 condition 平均对话轮数是否符合预期
- 询问参与者流程是否清晰、有无卡顿

**Pilot 数据处理：** 正式开始前在 Supabase SQL Editor 运行：

```sql
DELETE FROM scenario_responses WHERE participant_id IN (
  SELECT id FROM participants WHERE access_code = 'LAB2026'
);
DELETE FROM conversations WHERE participant_id IN (
  SELECT id FROM participants WHERE access_code = 'LAB2026'
);
DELETE FROM participants WHERE access_code = 'LAB2026';
```

---

## 第十步：数据导出

### 10.1 在 Supabase 界面导出

1. 左侧菜单点击 **Table Editor**
2. 选择要导出的表（如 `scenario_responses`）
3. 右上角点击 **Export → CSV**

### 10.2 用 SQL 导出合并数据（推荐）

在 SQL Editor 运行以下查询，导出用于分析的完整数据集：

```sql
-- 主分析数据集：参与者信息 + 每个scenario的DV
SELECT 
  p.id AS participant_id,
  p.access_code,
  p.latin_square_row,
  p.age,
  p.gender,
  p.prior_ai_use,
  -- 前测量表（计算均值用）
  p.ss_1, p.ss_2, p.ss_3,
  p.ai_1, p.ai_2, p.ai_3,
  p.dc_1, p.dc_2, p.dc_3,
  p.started_at,
  p.completed_at,
  -- Scenario level数据
  r.scenario_index,
  r.scenario_type,
  r.condition,
  r.dg_1, r.dg_2, r.dg_3, r.dg_4,
  r.bi_follow, r.bi_retry, r.bi_switch, r.bi_alone,
  r.med_understanding, r.med_agency, r.med_refusal,
  r.submitted_at
FROM participants p
JOIN scenario_responses r ON p.id = r.participant_id
WHERE p.completed_at IS NOT NULL   -- 只包含完成数据
ORDER BY p.started_at, r.scenario_index;
```

将结果导出为 CSV，即可用 SPSS、R 或 Python 进行分析。

### 10.3 导出对话记录（质性分析用）

```sql
SELECT 
  c.participant_id,
  c.scenario_type,
  c.condition,
  c.turn_index,
  c.role,
  c.content,
  c.created_at
FROM conversations c
JOIN participants p ON c.participant_id = p.id
WHERE p.completed_at IS NOT NULL
ORDER BY c.participant_id, c.scenario_index, c.turn_index;
```

---

## 常见问题

**Q: 参与者中途退出，数据还在吗？**
A: 在。每条消息和每个 scenario 完成后立即写入数据库，`completed_at` 为 NULL 表示未完成，但部分数据已保存。

**Q: 想修改问卷题目，需要动什么？**
A: 只改 `content/survey_items.py`，不需要动 app 逻辑。但注意 Supabase 的列名是固定的（`dg_1` 到 `dg_4` 等），如果增加题目需要在数据库加列。

**Q: 想换成 Prolific 招募，需要改什么？**
A: 主要改 `pages/landing.py`（读取 URL 参数中的 PROLIFIC_PID 替代 access code）和 `pages/debrief.py`（加 Prolific completion URL 跳转）。`content/` 和数据库不需要改动。

**Q: API 费用大概多少？**
A: Claude API 按 token 计费。每个参与者约有 4 次对话 × 每次约 3 轮，估算每位参与者费用在 $0.05–$0.15 之间。150 人约 $10–$20。

**Q: 如何监控实验进度？**
A: 在 Supabase SQL Editor 运行：
```sql
SELECT stage, COUNT(*) FROM participants GROUP BY stage;
SELECT COUNT(*) FROM participants WHERE completed_at IS NOT NULL;
```
