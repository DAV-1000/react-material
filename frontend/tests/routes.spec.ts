import { test, expect } from "@playwright/test";

// List of public routes with expected H1 titles
const publicRoutes = [
  { path: "/", title: "Welcome" },
  { path: "/features", title: "Features" },
  { path: "/testimonials", title: "Testimonials" },
  { path: "/highlights", title: "Highlights" },
  { path: "/pricing", title: "Pricing" },
  { path: "/faq", title: "FAQ" },
  { path: "/blog", title: "Posts" },
  { path: "/about", title: "About Us" },
  { path: "/careers", title: "Careers" },
  { path: "/press", title: "Press" },
  { path: "/terms", title: "Terms and Conditions" },
  { path: "/privacy", title: "Our Privacy Policy" },
  { path: "/contact", title: "Contact" },
  // { path: '/foo', title: 'Foo' },
];

test.describe("Public Routes", () => {
  for (const route of publicRoutes) {
    test(`should load ${route.path} successfully`, async ({
      page,
      baseURL,
    }) => {
      if (!baseURL) {
        throw new Error(
          "Environment variable STATIC_WEB_APP_URL is not defined or is empty."
        );
      }
      baseURL = baseURL.replace(/\/$/, "");
      const url = route.path.startsWith("http")
        ? route.path
        : `${baseURL}${route.path}`;
      console.log(url);
      await page.goto(url);

      // Check that the page has a body element
      await expect(page.locator("body")).toBeVisible();

      // Verify that the URL is correct
      await expect(page).toHaveURL(url);

      // Check for H1 page title if one is expected
      if (route.title) {
        const h1 = page.locator("h1");
        await expect(h1).toHaveCount(1); // ensure at least one exists
        await expect(h1.first()).toContainText(route.title, {
          ignoreCase: true,
        });
      }
    });
  }
});
