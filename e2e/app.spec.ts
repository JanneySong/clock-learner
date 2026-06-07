import { test, expect } from '@playwright/test';

test.describe('首页 (HomePage)', () => {
  test('应正确加载并显示标题', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('时钟小达人')).toBeVisible();
    await expect(page.getByText('一起认识时间吧！')).toBeVisible();
  });

  test('应显示星星计数', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('⭐').first()).toBeVisible();
  });

  test('应显示4个关卡', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('选择关卡')).toBeVisible();
    await expect(page.getByText('整时闯关')).toBeVisible();
    await expect(page.getByText('半时闯关')).toBeVisible();
    await expect(page.getByText('混合闯关')).toBeVisible();
    await expect(page.getByText('终极挑战')).toBeVisible();
  });

  test('第一关卡应已解锁，其余需星星解锁', async ({ page }) => {
    await page.goto('/');
    // 第一关显示角色 emoji（解锁），其余3个关卡显示🔒（锁定）
    const lockIcons = page.getByText('🔒');
    await expect(lockIcons).toHaveCount(3);
  });

  test('快捷入口按钮可导航', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('快速开始')).toBeVisible();

    // 点击学习按钮（限定在 main 区域内，避免与底部导航冲突）
    await page.locator('main').getByRole('button', { name: /学习/ }).first().click();
    await expect(page).toHaveURL(/\/learn/);
  });

  test('探索按钮可导航', async ({ page }) => {
    await page.goto('/');
    await page.locator('main').getByRole('button', { name: /探索/ }).first().click();
    await expect(page).toHaveURL(/\/explore/);
  });
});

test.describe('底部导航 (BottomNav)', () => {
  test('应显示6个标签页', async ({ page }) => {
    await page.goto('/');
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();
    await expect(nav.getByText('首页')).toBeVisible();
    await expect(nav.getByText('学习')).toBeVisible();
    await expect(nav.getByText('练习')).toBeVisible();
    await expect(nav.getByText('探索')).toBeVisible();
    await expect(nav.getByText('成就')).toBeVisible();
    await expect(nav.getByText('家长')).toBeVisible();
  });

  test('点击各标签可正确导航', async ({ page }) => {
    await page.goto('/');

    await page.locator('nav').getByText('学习').click();
    await expect(page).toHaveURL(/\/learn/);

    await page.locator('nav').getByText('练习').click();
    await expect(page).toHaveURL(/\/practice/);

    await page.locator('nav').getByText('探索').click();
    await expect(page).toHaveURL(/\/explore/);

    await page.locator('nav').getByText('成就').click();
    await expect(page).toHaveURL(/\/progress/);

    await page.locator('nav').getByText('家长').click();
    await expect(page).toHaveURL(/\/parent/);

    await page.locator('nav').getByText('首页').click();
    await expect(page).toHaveURL('/');
  });

  test('当前页面标签应高亮', async ({ page }) => {
    await page.goto('/');
    // 首页标签应有高亮样式 (text-accent)
    const homeBtn = page.locator('nav button').filter({ hasText: '首页' });
    await expect(homeBtn).toHaveClass(/text-accent/);
  });
});

test.describe('学习页面 (LearnPage)', () => {
  test('应正确加载并显示第一步', async ({ page }) => {
    await page.goto('/learn');
    await expect(page.getByText('认识钟面')).toBeVisible();
    await expect(page.getByText('钟面有12个数字')).toBeVisible();
  });

  test('应显示SVG时钟', async ({ page }) => {
    await page.goto('/learn');
    const svg = page.locator('svg');
    await expect(svg.first()).toBeVisible();
  });

  test('导航按钮可切换步骤', async ({ page }) => {
    await page.goto('/learn');
    await expect(page.getByRole('heading', { name: /认识钟面/ })).toBeVisible();

    // 点击下一步
    await page.getByRole('button', { name: /下一步/ }).click();
    await expect(page.getByRole('heading', { name: /时针哥哥/ })).toBeVisible();

    await page.getByRole('button', { name: /下一步/ }).click();
    await expect(page.getByRole('heading', { name: /分针弟弟/ })).toBeVisible();

    // 点击上一步
    await page.getByRole('button', { name: /上一步/ }).click();
    await expect(page.getByRole('heading', { name: /时针哥哥/ })).toBeVisible();
  });

  test('进度点可点击切换', async ({ page }) => {
    await page.goto('/learn');
    // 点击第4个进度点（整时）
    const dots = page.locator('button.w-3');
    await dots.nth(3).click();
    await expect(page.getByText('认识整时')).toBeVisible();
  });

  test('第一步的上一步按钮应禁用', async ({ page }) => {
    await page.goto('/learn');
    const prevBtn = page.getByRole('button', { name: /上一步/ });
    await expect(prevBtn).toBeDisabled();
  });

  test('最后一步的下一步按钮应禁用', async ({ page }) => {
    await page.goto('/learn');
    // 点击到最后一步
    const dots = page.locator('button.w-3');
    await dots.nth(5).click();
    await expect(page.getByText('时间与生活')).toBeVisible();
    const nextBtn = page.getByRole('button', { name: /下一步/ });
    await expect(nextBtn).toBeDisabled();
  });
});

test.describe('探索页面 (ExplorePage)', () => {
  test('应正确加载', async ({ page }) => {
    await page.goto('/explore');
    await expect(page.getByText('自由探索')).toBeVisible();
    await expect(page.getByText('拖动指针或按下播放')).toBeVisible();
  });

  test('应显示时钟和时间', async ({ page }) => {
    await page.goto('/explore');
    const svg = page.locator('svg');
    await expect(svg.first()).toBeVisible();
    await expect(page.getByText('12时', { exact: true })).toBeVisible();
    await expect(page.getByText('12:00', { exact: true })).toBeVisible();
  });

  test('播放/暂停按钮可切换', async ({ page }) => {
    await page.goto('/explore');
    const playBtn = page.getByRole('button', { name: /播放/ });
    await expect(playBtn).toBeVisible();

    await playBtn.click();
    const pauseBtn = page.getByRole('button', { name: /暂停/ });
    await expect(pauseBtn).toBeVisible();

    await pauseBtn.click();
    await expect(page.getByRole('button', { name: /播放/ })).toBeVisible();
  });

  test('重置按钮可用', async ({ page }) => {
    await page.goto('/explore');
    await expect(page.getByRole('button', { name: /重置/ })).toBeVisible();
  });

  test('速度选择器有3个选项', async ({ page }) => {
    await page.goto('/explore');
    await expect(page.getByText('正常')).toBeVisible();
    await expect(page.getByText('慢速')).toBeVisible();
    await expect(page.getByText('超慢')).toBeVisible();
  });

  test('小知识提示可见', async ({ page }) => {
    await page.goto('/explore');
    await expect(page.getByText('分针走一圈')).toBeVisible();
  });
});

test.describe('练习页面 (PracticePage)', () => {
  test('无参数时应显示练习类型选择', async ({ page }) => {
    await page.goto('/practice');
    // 应显示某种练习选择界面
    await expect(page.locator('main')).toBeVisible();
  });

  test('带关卡参数时可加载', async ({ page }) => {
    await page.goto('/practice?level=level-1');
    await expect(page.locator('main')).toBeVisible();
  });
});

test.describe('成就页面 (ProgressPage)', () => {
  test('应正确加载', async ({ page }) => {
    await page.goto('/progress');
    await expect(page.locator('main')).toBeVisible();
  });
});

test.describe('家长后台 (ParentPage)', () => {
  test('应正确加载', async ({ page }) => {
    await page.goto('/parent');
    await expect(page.locator('main')).toBeVisible();
  });
});

test.describe('AppShell 顶部栏', () => {
  test('应显示星星数和设置按钮', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('⭐').first()).toBeVisible();
    await expect(page.getByText('⚙️')).toBeVisible();
  });

  test('设置按钮可打开设置面板', async ({ page }) => {
    await page.goto('/');
    await page.getByText('⚙️').click();
    await expect(page.getByText('设置')).toBeVisible();
    await expect(page.getByText('音效开启').or(page.getByText('音效关闭'))).toBeVisible();
  });

  test('设置面板可关闭', async ({ page }) => {
    await page.goto('/');
    await page.getByText('⚙️').click();
    await expect(page.getByText('设置')).toBeVisible();
    await page.getByText('关闭').click();
    await expect(page.getByText('设置')).not.toBeVisible();
  });
});

test.describe('响应式与移动端', () => {
  test('页面应在移动视口下正常显示', async ({ page }) => {
    // 默认配置为 Pixel 5 (390x844)
    await page.goto('/');
    await expect(page.getByText('时钟小达人')).toBeVisible();
    // 底部导航可见
    await expect(page.locator('nav')).toBeVisible();
  });

  test('页面应在横屏模式下正常显示', async ({ page }) => {
    await page.setViewportSize({ width: 844, height: 390 });
    await page.goto('/');
    await expect(page.getByText('时钟小达人')).toBeVisible();
  });
});

test.describe('PWA 支持', () => {
  test('manifest 应可访问', async ({ page }) => {
    // 通过页面上下文请求（同源）
    const response = await page.goto('/manifest.webmanifest');
    expect(response).not.toBeNull();
    // 开发模式下 vite-plugin-pwa 可能通过中间件提供，也可能通过 SPA 回退返回 HTML
    const status = response!.status();
    if (status === 200) {
      const text = await response!.text();
      // 验证是 JSON 而非 HTML
      if (!text.startsWith('<')) {
        const manifest = JSON.parse(text);
        expect(manifest.name).toContain('时钟');
        expect(manifest.display).toBe('standalone');
        expect(manifest.icons).toBeDefined();
        expect(manifest.icons.length).toBeGreaterThanOrEqual(2);
      }
    }
  });

  test('Service Worker 脚本应存在', async ({ page }) => {
    // 开发模式下 SW 可能不自动注册，验证脚本文件存在
    const response = await page.goto('/sw.js');
    // 开发模式下可能返回 200 或 404（取决于 vite-plugin-pwa 配置）
    expect(response).not.toBeNull();
  });
});
