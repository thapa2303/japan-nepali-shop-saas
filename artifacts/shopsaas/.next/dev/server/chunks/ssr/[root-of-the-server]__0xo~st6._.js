module.exports = [
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[project]/artifacts/shopsaas/lib/utils.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cn",
    ()=>cn
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$clsx$40$2$2e$1$2e$1$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/clsx@2.1.1/node_modules/clsx/dist/clsx.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tailwind$2d$merge$40$3$2e$4$2e$0$2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/tailwind-merge@3.4.0/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-rsc] (ecmascript)");
;
;
function cn(...inputs) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tailwind$2d$merge$40$3$2e$4$2e$0$2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$clsx$40$2$2e$1$2e$1$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
}),
"[project]/artifacts/shopsaas/components/ui/badge.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Badge",
    ()=>Badge,
    "badgeVariants",
    ()=>badgeVariants
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.2.6_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$slot$40$1$2e$2$2e$4_$40$types$2b$react$40$19$2e$2$2e$14_react$40$19$2e$2$2e$4$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-slot@1.2.4_@types+react@19.2.14_react@19.2.4/node_modules/@radix-ui/react-slot/dist/index.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$class$2d$variance$2d$authority$40$0$2e$7$2e$1$2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/class-variance-authority@0.7.1/node_modules/class-variance-authority/dist/index.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$artifacts$2f$shopsaas$2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/artifacts/shopsaas/lib/utils.ts [app-rsc] (ecmascript)");
;
;
;
;
const badgeVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$class$2d$variance$2d$authority$40$0$2e$7$2e$1$2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cva"])('inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden', {
    variants: {
        variant: {
            default: 'border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90',
            secondary: 'border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90',
            destructive: 'border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
            outline: 'text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground'
        }
    },
    defaultVariants: {
        variant: 'default'
    }
});
function Badge({ className, variant, asChild = false, ...props }) {
    const Comp = asChild ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$slot$40$1$2e$2$2e$4_$40$types$2b$react$40$19$2e$2$2e$14_react$40$19$2e$2$2e$4$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Slot"] : 'span';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(Comp, {
        "data-slot": "badge",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$artifacts$2f$shopsaas$2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cn"])(badgeVariants({
            variant
        }), className),
        ...props
    }, void 0, false, {
        fileName: "[project]/artifacts/shopsaas/components/ui/badge.tsx",
        lineNumber: 38,
        columnNumber: 5
    }, this);
}
;
}),
"[project]/artifacts/shopsaas/components/ui/button.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Button",
    ()=>Button,
    "buttonVariants",
    ()=>buttonVariants
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.2.6_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$slot$40$1$2e$2$2e$4_$40$types$2b$react$40$19$2e$2$2e$14_react$40$19$2e$2$2e$4$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-slot@1.2.4_@types+react@19.2.14_react@19.2.4/node_modules/@radix-ui/react-slot/dist/index.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$class$2d$variance$2d$authority$40$0$2e$7$2e$1$2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/class-variance-authority@0.7.1/node_modules/class-variance-authority/dist/index.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$artifacts$2f$shopsaas$2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/artifacts/shopsaas/lib/utils.ts [app-rsc] (ecmascript)");
;
;
;
;
const buttonVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$class$2d$variance$2d$authority$40$0$2e$7$2e$1$2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cva"])("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive", {
    variants: {
        variant: {
            default: 'bg-primary text-primary-foreground hover:bg-primary/90',
            destructive: 'bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
            outline: 'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50',
            secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
            ghost: 'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
            link: 'text-primary underline-offset-4 hover:underline'
        },
        size: {
            default: 'h-9 px-4 py-2 has-[>svg]:px-3',
            sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
            lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
            icon: 'size-9',
            'icon-sm': 'size-8',
            'icon-lg': 'size-10'
        }
    },
    defaultVariants: {
        variant: 'default',
        size: 'default'
    }
});
function Button({ className, variant, size, asChild = false, ...props }) {
    const Comp = asChild ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$slot$40$1$2e$2$2e$4_$40$types$2b$react$40$19$2e$2$2e$14_react$40$19$2e$2$2e$4$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Slot"] : 'button';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(Comp, {
        "data-slot": "button",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$artifacts$2f$shopsaas$2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cn"])(buttonVariants({
            variant,
            size,
            className
        })),
        ...props
    }, void 0, false, {
        fileName: "[project]/artifacts/shopsaas/components/ui/button.tsx",
        lineNumber: 52,
        columnNumber: 5
    }, this);
}
;
}),
"[project]/artifacts/shopsaas/components/shops/shop-hero.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ShopHero",
    ()=>ShopHero
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.2.6_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.2.6_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/image.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$564$2e$0_react$40$19$2e$2$2e$4$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.564.0_react@19.2.4/node_modules/lucide-react/dist/esm/icons/clock.js [app-rsc] (ecmascript) <export default as Clock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$564$2e$0_react$40$19$2e$2$2e$4$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.564.0_react@19.2.4/node_modules/lucide-react/dist/esm/icons/map-pin.js [app-rsc] (ecmascript) <export default as MapPin>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$564$2e$0_react$40$19$2e$2$2e$4$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$phone$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Phone$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.564.0_react@19.2.4/node_modules/lucide-react/dist/esm/icons/phone.js [app-rsc] (ecmascript) <export default as Phone>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$564$2e$0_react$40$19$2e$2$2e$4$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.564.0_react@19.2.4/node_modules/lucide-react/dist/esm/icons/star.js [app-rsc] (ecmascript) <export default as Star>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$564$2e$0_react$40$19$2e$2$2e$4$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$circle$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.564.0_react@19.2.4/node_modules/lucide-react/dist/esm/icons/message-circle.js [app-rsc] (ecmascript) <export default as MessageCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$artifacts$2f$shopsaas$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/artifacts/shopsaas/components/ui/badge.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$artifacts$2f$shopsaas$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/artifacts/shopsaas/components/ui/button.tsx [app-rsc] (ecmascript)");
;
;
;
;
;
function ShopHero({ shop }) {
    const today = new Date().toLocaleDateString("en-US", {
        weekday: "long"
    }).toLowerCase();
    const todayHours = shop.openingHours[today];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative h-48 sm:h-64 md:h-80 w-full overflow-hidden bg-muted",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                        src: shop.coverImage,
                        alt: shop.name,
                        fill: true,
                        className: "object-cover",
                        priority: true
                    }, void 0, false, {
                        fileName: "[project]/artifacts/shopsaas/components/shops/shop-hero.tsx",
                        lineNumber: 19,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"
                    }, void 0, false, {
                        fileName: "[project]/artifacts/shopsaas/components/shops/shop-hero.tsx",
                        lineNumber: 26,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/artifacts/shopsaas/components/shops/shop-hero.tsx",
                lineNumber: 18,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "container px-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "relative -mt-20 sm:-mt-24",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col sm:flex-row gap-4 sm:items-end",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "relative h-24 w-24 sm:h-32 sm:w-32 shrink-0 overflow-hidden rounded-xl border-4 border-background bg-background shadow-lg",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                                        src: shop.logo,
                                        alt: `${shop.name} logo`,
                                        fill: true,
                                        className: "object-cover"
                                    }, void 0, false, {
                                        fileName: "[project]/artifacts/shopsaas/components/shops/shop-hero.tsx",
                                        lineNumber: 35,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/artifacts/shopsaas/components/shops/shop-hero.tsx",
                                    lineNumber: 34,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex-1 pb-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex flex-wrap items-center gap-2 mb-2",
                                            children: [
                                                shop.isOpen ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$artifacts$2f$shopsaas$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Badge"], {
                                                    className: "bg-green-600 hover:bg-green-600",
                                                    children: "Open Now"
                                                }, void 0, false, {
                                                    fileName: "[project]/artifacts/shopsaas/components/shops/shop-hero.tsx",
                                                    lineNumber: 47,
                                                    columnNumber: 19
                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$artifacts$2f$shopsaas$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Badge"], {
                                                    variant: "secondary",
                                                    children: "Closed"
                                                }, void 0, false, {
                                                    fileName: "[project]/artifacts/shopsaas/components/shops/shop-hero.tsx",
                                                    lineNumber: 49,
                                                    columnNumber: 19
                                                }, this),
                                                shop.featured && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$artifacts$2f$shopsaas$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Badge"], {
                                                    className: "bg-accent text-accent-foreground hover:bg-accent",
                                                    children: "Featured"
                                                }, void 0, false, {
                                                    fileName: "[project]/artifacts/shopsaas/components/shops/shop-hero.tsx",
                                                    lineNumber: 52,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/artifacts/shopsaas/components/shops/shop-hero.tsx",
                                            lineNumber: 45,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                            className: "text-2xl sm:text-3xl font-bold text-white sm:text-foreground",
                                            children: shop.name
                                        }, void 0, false, {
                                            fileName: "[project]/artifacts/shopsaas/components/shops/shop-hero.tsx",
                                            lineNumber: 56,
                                            columnNumber: 15
                                        }, this),
                                        shop.nameNepali && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-white/80 sm:text-muted-foreground mt-0.5",
                                            children: shop.nameNepali
                                        }, void 0, false, {
                                            fileName: "[project]/artifacts/shopsaas/components/shops/shop-hero.tsx",
                                            lineNumber: 60,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex flex-wrap items-center gap-4 mt-2 text-sm text-white sm:text-foreground",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-1",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$564$2e$0_react$40$19$2e$2$2e$4$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__["Star"], {
                                                            className: "h-4 w-4 fill-yellow-400 text-yellow-400"
                                                        }, void 0, false, {
                                                            fileName: "[project]/artifacts/shopsaas/components/shops/shop-hero.tsx",
                                                            lineNumber: 67,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "font-medium",
                                                            children: shop.rating
                                                        }, void 0, false, {
                                                            fileName: "[project]/artifacts/shopsaas/components/shops/shop-hero.tsx",
                                                            lineNumber: 68,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-white/70 sm:text-muted-foreground",
                                                            children: [
                                                                "(",
                                                                shop.reviewCount,
                                                                " reviews)"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/artifacts/shopsaas/components/shops/shop-hero.tsx",
                                                            lineNumber: 69,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/artifacts/shopsaas/components/shops/shop-hero.tsx",
                                                    lineNumber: 66,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "capitalize text-white/70 sm:text-muted-foreground",
                                                    children: shop.category.replace("-", " ")
                                                }, void 0, false, {
                                                    fileName: "[project]/artifacts/shopsaas/components/shops/shop-hero.tsx",
                                                    lineNumber: 73,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/artifacts/shopsaas/components/shops/shop-hero.tsx",
                                            lineNumber: 65,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/artifacts/shopsaas/components/shops/shop-hero.tsx",
                                    lineNumber: 44,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "hidden sm:flex gap-2 pb-2",
                                    children: [
                                        shop.contact.whatsapp && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$artifacts$2f$shopsaas$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Button"], {
                                            variant: "outline",
                                            size: "sm",
                                            asChild: true,
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                href: `https://wa.me/${shop.contact.whatsapp.replace(/[^0-9]/g, "")}`,
                                                target: "_blank",
                                                rel: "noopener noreferrer",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$564$2e$0_react$40$19$2e$2$2e$4$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$circle$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageCircle$3e$__["MessageCircle"], {
                                                        className: "h-4 w-4 mr-2"
                                                    }, void 0, false, {
                                                        fileName: "[project]/artifacts/shopsaas/components/shops/shop-hero.tsx",
                                                        lineNumber: 84,
                                                        columnNumber: 21
                                                    }, this),
                                                    "WhatsApp"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/artifacts/shopsaas/components/shops/shop-hero.tsx",
                                                lineNumber: 83,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/artifacts/shopsaas/components/shops/shop-hero.tsx",
                                            lineNumber: 82,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$artifacts$2f$shopsaas$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Button"], {
                                            variant: "outline",
                                            size: "sm",
                                            asChild: true,
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                href: `tel:${shop.contact.phone}`,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$564$2e$0_react$40$19$2e$2$2e$4$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$phone$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Phone$3e$__["Phone"], {
                                                        className: "h-4 w-4 mr-2"
                                                    }, void 0, false, {
                                                        fileName: "[project]/artifacts/shopsaas/components/shops/shop-hero.tsx",
                                                        lineNumber: 91,
                                                        columnNumber: 19
                                                    }, this),
                                                    "Call"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/artifacts/shopsaas/components/shops/shop-hero.tsx",
                                                lineNumber: 90,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/artifacts/shopsaas/components/shops/shop-hero.tsx",
                                            lineNumber: 89,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/artifacts/shopsaas/components/shops/shop-hero.tsx",
                                    lineNumber: 80,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/artifacts/shopsaas/components/shops/shop-hero.tsx",
                            lineNumber: 32,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/artifacts/shopsaas/components/shops/shop-hero.tsx",
                        lineNumber: 31,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-start gap-3 p-4 rounded-lg bg-secondary/50",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$564$2e$0_react$40$19$2e$2$2e$4$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__["MapPin"], {
                                        className: "h-5 w-5 text-primary shrink-0 mt-0.5"
                                    }, void 0, false, {
                                        fileName: "[project]/artifacts/shopsaas/components/shops/shop-hero.tsx",
                                        lineNumber: 103,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "font-medium text-sm",
                                                children: "Location"
                                            }, void 0, false, {
                                                fileName: "[project]/artifacts/shopsaas/components/shops/shop-hero.tsx",
                                                lineNumber: 105,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-muted-foreground mt-0.5",
                                                children: shop.location.address
                                            }, void 0, false, {
                                                fileName: "[project]/artifacts/shopsaas/components/shops/shop-hero.tsx",
                                                lineNumber: 106,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-muted-foreground",
                                                children: [
                                                    shop.location.area,
                                                    ", ",
                                                    shop.location.city,
                                                    ", ",
                                                    shop.location.prefecture
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/artifacts/shopsaas/components/shops/shop-hero.tsx",
                                                lineNumber: 109,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/artifacts/shopsaas/components/shops/shop-hero.tsx",
                                        lineNumber: 104,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/artifacts/shopsaas/components/shops/shop-hero.tsx",
                                lineNumber: 102,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-start gap-3 p-4 rounded-lg bg-secondary/50",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$564$2e$0_react$40$19$2e$2$2e$4$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                                        className: "h-5 w-5 text-primary shrink-0 mt-0.5"
                                    }, void 0, false, {
                                        fileName: "[project]/artifacts/shopsaas/components/shops/shop-hero.tsx",
                                        lineNumber: 117,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "font-medium text-sm",
                                                children: "Today's Hours"
                                            }, void 0, false, {
                                                fileName: "[project]/artifacts/shopsaas/components/shops/shop-hero.tsx",
                                                lineNumber: 119,
                                                columnNumber: 15
                                            }, this),
                                            todayHours.isClosed ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-muted-foreground mt-0.5",
                                                children: "Closed today"
                                            }, void 0, false, {
                                                fileName: "[project]/artifacts/shopsaas/components/shops/shop-hero.tsx",
                                                lineNumber: 121,
                                                columnNumber: 17
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-muted-foreground mt-0.5",
                                                children: [
                                                    todayHours.open,
                                                    " - ",
                                                    todayHours.close
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/artifacts/shopsaas/components/shops/shop-hero.tsx",
                                                lineNumber: 123,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/artifacts/shopsaas/components/shops/shop-hero.tsx",
                                        lineNumber: 118,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/artifacts/shopsaas/components/shops/shop-hero.tsx",
                                lineNumber: 116,
                                columnNumber: 11
                            }, this),
                            shop.deliveryTime && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-start gap-3 p-4 rounded-lg bg-secondary/50",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        className: "h-5 w-5 text-primary shrink-0 mt-0.5",
                                        fill: "none",
                                        viewBox: "0 0 24 24",
                                        stroke: "currentColor",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            strokeLinecap: "round",
                                            strokeLinejoin: "round",
                                            strokeWidth: 2,
                                            d: "M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"
                                        }, void 0, false, {
                                            fileName: "[project]/artifacts/shopsaas/components/shops/shop-hero.tsx",
                                            lineNumber: 134,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/artifacts/shopsaas/components/shops/shop-hero.tsx",
                                        lineNumber: 133,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "font-medium text-sm",
                                                children: "Delivery"
                                            }, void 0, false, {
                                                fileName: "[project]/artifacts/shopsaas/components/shops/shop-hero.tsx",
                                                lineNumber: 137,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-muted-foreground mt-0.5",
                                                children: shop.deliveryTime
                                            }, void 0, false, {
                                                fileName: "[project]/artifacts/shopsaas/components/shops/shop-hero.tsx",
                                                lineNumber: 138,
                                                columnNumber: 17
                                            }, this),
                                            shop.deliveryFee !== undefined && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-muted-foreground",
                                                children: [
                                                    "¥",
                                                    shop.deliveryFee,
                                                    " delivery fee"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/artifacts/shopsaas/components/shops/shop-hero.tsx",
                                                lineNumber: 142,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/artifacts/shopsaas/components/shops/shop-hero.tsx",
                                        lineNumber: 136,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/artifacts/shopsaas/components/shops/shop-hero.tsx",
                                lineNumber: 132,
                                columnNumber: 13
                            }, this),
                            shop.minOrder && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-start gap-3 p-4 rounded-lg bg-secondary/50",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        className: "h-5 w-5 text-primary shrink-0 mt-0.5",
                                        fill: "none",
                                        viewBox: "0 0 24 24",
                                        stroke: "currentColor",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            strokeLinecap: "round",
                                            strokeLinejoin: "round",
                                            strokeWidth: 2,
                                            d: "M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                                        }, void 0, false, {
                                            fileName: "[project]/artifacts/shopsaas/components/shops/shop-hero.tsx",
                                            lineNumber: 154,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/artifacts/shopsaas/components/shops/shop-hero.tsx",
                                        lineNumber: 153,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "font-medium text-sm",
                                                children: "Minimum Order"
                                            }, void 0, false, {
                                                fileName: "[project]/artifacts/shopsaas/components/shops/shop-hero.tsx",
                                                lineNumber: 157,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-muted-foreground mt-0.5",
                                                children: [
                                                    "¥",
                                                    shop.minOrder.toLocaleString()
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/artifacts/shopsaas/components/shops/shop-hero.tsx",
                                                lineNumber: 158,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/artifacts/shopsaas/components/shops/shop-hero.tsx",
                                        lineNumber: 156,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/artifacts/shopsaas/components/shops/shop-hero.tsx",
                                lineNumber: 152,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/artifacts/shopsaas/components/shops/shop-hero.tsx",
                        lineNumber: 100,
                        columnNumber: 9
                    }, this),
                    shop.features.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-4 flex flex-wrap gap-2",
                        children: shop.features.map((feature)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$artifacts$2f$shopsaas$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Badge"], {
                                variant: "outline",
                                className: "capitalize",
                                children: feature.replace("-", " ")
                            }, feature, false, {
                                fileName: "[project]/artifacts/shopsaas/components/shops/shop-hero.tsx",
                                lineNumber: 170,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/artifacts/shopsaas/components/shops/shop-hero.tsx",
                        lineNumber: 168,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-2 mt-4 sm:hidden",
                        children: [
                            shop.contact.whatsapp && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$artifacts$2f$shopsaas$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Button"], {
                                variant: "outline",
                                size: "sm",
                                className: "flex-1",
                                asChild: true,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                    href: `https://wa.me/${shop.contact.whatsapp.replace(/[^0-9]/g, "")}`,
                                    target: "_blank",
                                    rel: "noopener noreferrer",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$564$2e$0_react$40$19$2e$2$2e$4$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$circle$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageCircle$3e$__["MessageCircle"], {
                                            className: "h-4 w-4 mr-2"
                                        }, void 0, false, {
                                            fileName: "[project]/artifacts/shopsaas/components/shops/shop-hero.tsx",
                                            lineNumber: 182,
                                            columnNumber: 17
                                        }, this),
                                        "WhatsApp"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/artifacts/shopsaas/components/shops/shop-hero.tsx",
                                    lineNumber: 181,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/artifacts/shopsaas/components/shops/shop-hero.tsx",
                                lineNumber: 180,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$artifacts$2f$shopsaas$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Button"], {
                                variant: "outline",
                                size: "sm",
                                className: "flex-1",
                                asChild: true,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                    href: `tel:${shop.contact.phone}`,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$564$2e$0_react$40$19$2e$2$2e$4$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$phone$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Phone$3e$__["Phone"], {
                                            className: "h-4 w-4 mr-2"
                                        }, void 0, false, {
                                            fileName: "[project]/artifacts/shopsaas/components/shops/shop-hero.tsx",
                                            lineNumber: 189,
                                            columnNumber: 15
                                        }, this),
                                        "Call"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/artifacts/shopsaas/components/shops/shop-hero.tsx",
                                    lineNumber: 188,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/artifacts/shopsaas/components/shops/shop-hero.tsx",
                                lineNumber: 187,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/artifacts/shopsaas/components/shops/shop-hero.tsx",
                        lineNumber: 178,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-6 p-4 rounded-lg bg-card border",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "font-semibold mb-2",
                                children: "About"
                            }, void 0, false, {
                                fileName: "[project]/artifacts/shopsaas/components/shops/shop-hero.tsx",
                                lineNumber: 197,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-muted-foreground",
                                children: shop.description
                            }, void 0, false, {
                                fileName: "[project]/artifacts/shopsaas/components/shops/shop-hero.tsx",
                                lineNumber: 198,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/artifacts/shopsaas/components/shops/shop-hero.tsx",
                        lineNumber: 196,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/artifacts/shopsaas/components/shops/shop-hero.tsx",
                lineNumber: 30,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/artifacts/shopsaas/components/shops/shop-hero.tsx",
        lineNumber: 16,
        columnNumber: 5
    }, this);
}
}),
"[project]/artifacts/shopsaas/components/products/product-card.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ProductCard",
    ()=>ProductCard
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.2.6_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const ProductCard = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call ProductCard() from the server but ProductCard is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/artifacts/shopsaas/components/products/product-card.tsx <module evaluation>", "ProductCard");
}),
"[project]/artifacts/shopsaas/components/products/product-card.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ProductCard",
    ()=>ProductCard
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.2.6_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const ProductCard = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call ProductCard() from the server but ProductCard is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/artifacts/shopsaas/components/products/product-card.tsx", "ProductCard");
}),
"[project]/artifacts/shopsaas/components/products/product-card.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$artifacts$2f$shopsaas$2f$components$2f$products$2f$product$2d$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/artifacts/shopsaas/components/products/product-card.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$artifacts$2f$shopsaas$2f$components$2f$products$2f$product$2d$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/artifacts/shopsaas/components/products/product-card.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$artifacts$2f$shopsaas$2f$components$2f$products$2f$product$2d$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/artifacts/shopsaas/components/products/product-grid.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ProductGrid",
    ()=>ProductGrid
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.2.6_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$artifacts$2f$shopsaas$2f$components$2f$products$2f$product$2d$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/artifacts/shopsaas/components/products/product-card.tsx [app-rsc] (ecmascript)");
;
;
function ProductGrid({ products, shopSlug }) {
    if (products.length === 0) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-col items-center justify-center py-12 text-center",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "rounded-full bg-muted p-6 mb-4",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                        className: "h-12 w-12 text-muted-foreground",
                        fill: "none",
                        viewBox: "0 0 24 24",
                        stroke: "currentColor",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                            strokeLinecap: "round",
                            strokeLinejoin: "round",
                            strokeWidth: 1.5,
                            d: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                        }, void 0, false, {
                            fileName: "[project]/artifacts/shopsaas/components/products/product-grid.tsx",
                            lineNumber: 20,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/artifacts/shopsaas/components/products/product-grid.tsx",
                        lineNumber: 14,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/artifacts/shopsaas/components/products/product-grid.tsx",
                    lineNumber: 13,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                    className: "font-semibold text-lg",
                    children: "No products found"
                }, void 0, false, {
                    fileName: "[project]/artifacts/shopsaas/components/products/product-grid.tsx",
                    lineNumber: 28,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-sm text-muted-foreground mt-1",
                    children: "This shop hasn't added any products in this category yet."
                }, void 0, false, {
                    fileName: "[project]/artifacts/shopsaas/components/products/product-grid.tsx",
                    lineNumber: 29,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/artifacts/shopsaas/components/products/product-grid.tsx",
            lineNumber: 12,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5",
        children: products.map((product)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$artifacts$2f$shopsaas$2f$components$2f$products$2f$product$2d$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ProductCard"], {
                product: product,
                shopSlug: shopSlug
            }, product.id, false, {
                fileName: "[project]/artifacts/shopsaas/components/products/product-grid.tsx",
                lineNumber: 39,
                columnNumber: 9
            }, this))
    }, void 0, false, {
        fileName: "[project]/artifacts/shopsaas/components/products/product-grid.tsx",
        lineNumber: 37,
        columnNumber: 5
    }, this);
}
}),
"[project]/artifacts/shopsaas/lib/mock-data/shops.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getFeaturedShops",
    ()=>getFeaturedShops,
    "getShopById",
    ()=>getShopById,
    "getShopBySlug",
    ()=>getShopBySlug,
    "getShopsByCategory",
    ()=>getShopsByCategory,
    "searchShops",
    ()=>searchShops,
    "shops",
    ()=>shops
]);
const defaultHours = {
    monday: {
        open: "10:00",
        close: "21:00",
        isClosed: false
    },
    tuesday: {
        open: "10:00",
        close: "21:00",
        isClosed: false
    },
    wednesday: {
        open: "10:00",
        close: "21:00",
        isClosed: false
    },
    thursday: {
        open: "10:00",
        close: "21:00",
        isClosed: false
    },
    friday: {
        open: "10:00",
        close: "22:00",
        isClosed: false
    },
    saturday: {
        open: "10:00",
        close: "22:00",
        isClosed: false
    },
    sunday: {
        open: "10:00",
        close: "21:00",
        isClosed: false
    }
};
const shops = [
    {
        id: "1",
        slug: "himalaya-asian-mart",
        name: "Himalaya Asian Mart",
        nameNepali: "हिमालय एसियन मार्ट",
        description: "Shin-Okubo's favorite Nepali grocery store. Find authentic Nepali spices, lentils, rice, momo wrappers, and hard-to-get ingredients straight from home. We ship across Japan.",
        category: "groceries",
        subcategories: [
            "spices",
            "lentils",
            "rice",
            "snacks"
        ],
        coverImage: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&h=400&fit=crop",
        logo: "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=200&h=200&fit=crop",
        rating: 4.8,
        reviewCount: 412,
        isOpen: true,
        openingHours: defaultHours,
        location: {
            address: "1-12-5 Hyakunincho",
            area: "Shin-Okubo",
            city: "Shinjuku",
            prefecture: "Tokyo",
            postalCode: "169-0073",
            coordinates: {
                lat: 35.7012,
                lng: 139.7003
            }
        },
        contact: {
            phone: "+81-3-1234-5678",
            whatsapp: "+81-90-1234-5678"
        },
        googleMapsTag: "ネパール物産店",
        googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=35.7012,139.7003",
        onlineStoreUrl: "/shops/himalaya-asian-mart",
        features: [
            "delivery",
            "pickup",
            "cash-on-delivery",
            "digital-payment"
        ],
        minOrder: 1500,
        deliveryFee: 500,
        deliveryTime: "1-2 days",
        featured: true
    },
    {
        id: "2",
        slug: "everest-nepali-kitchen",
        name: "Everest Nepali Kitchen",
        nameNepali: "एभरेस्ट नेपाली किचन",
        description: "Home-cooked Nepali momo, sel roti, sukuti, and achar made fresh daily. Order our frozen momo packs and festival specials for delivery anywhere in Japan.",
        category: "food-beverages",
        subcategories: [
            "momo",
            "sweets",
            "achar",
            "ready-to-eat"
        ],
        coverImage: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=400&fit=crop",
        logo: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=200&h=200&fit=crop",
        rating: 4.9,
        reviewCount: 587,
        isOpen: true,
        openingHours: {
            ...defaultHours,
            monday: {
                open: "11:00",
                close: "22:00",
                isClosed: false
            },
            tuesday: {
                open: "11:00",
                close: "22:00",
                isClosed: false
            },
            wednesday: {
                open: "11:00",
                close: "22:00",
                isClosed: false
            },
            thursday: {
                open: "11:00",
                close: "22:00",
                isClosed: false
            },
            friday: {
                open: "11:00",
                close: "23:00",
                isClosed: false
            },
            saturday: {
                open: "11:00",
                close: "23:00",
                isClosed: false
            },
            sunday: {
                open: "11:00",
                close: "22:00",
                isClosed: false
            }
        },
        location: {
            address: "2-1-3 Okubo",
            area: "Okubo",
            city: "Shinjuku",
            prefecture: "Tokyo",
            postalCode: "169-0072",
            coordinates: {
                lat: 35.7008,
                lng: 139.6970
            }
        },
        contact: {
            phone: "+81-3-2345-6789",
            whatsapp: "+81-90-2345-6789"
        },
        googleMapsTag: "ネパール料理店",
        googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=35.7008,139.6970",
        onlineStoreUrl: "/shops/everest-nepali-kitchen",
        features: [
            "delivery",
            "pickup",
            "cash-on-delivery",
            "digital-payment"
        ],
        minOrder: 1000,
        deliveryFee: 400,
        deliveryTime: "Same day (order by 3pm)",
        featured: true
    },
    {
        id: "3",
        slug: "nepal-fashion-house",
        name: "Nepal Fashion House",
        nameNepali: "नेपाल फेसन हाउस",
        description: "Traditional Nepali clothing for the diaspora. Daura suruwal, sarees, kurta, dhaka topi, and festival wear for Dashain, Tihar, and weddings. Delivered across Japan.",
        category: "fashion",
        subcategories: [
            "traditional",
            "festival-wear",
            "accessories",
            "saree"
        ],
        coverImage: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800&h=400&fit=crop",
        logo: "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=200&h=200&fit=crop",
        rating: 4.6,
        reviewCount: 213,
        isOpen: true,
        openingHours: defaultHours,
        location: {
            address: "1-2-9 Takadanobaba",
            area: "Takadanobaba",
            city: "Shinjuku",
            prefecture: "Tokyo",
            postalCode: "169-0075",
            coordinates: {
                lat: 35.7126,
                lng: 139.7038
            }
        },
        contact: {
            phone: "+81-3-3456-7890",
            whatsapp: "+81-90-3456-7890"
        },
        googleMapsTag: "民族衣装店",
        googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=35.7126,139.7038",
        onlineStoreUrl: "/shops/nepal-fashion-house",
        features: [
            "pickup",
            "delivery",
            "digital-payment"
        ],
        minOrder: 2000,
        deliveryFee: 600,
        deliveryTime: "2-3 days",
        featured: true
    },
    {
        id: "4",
        slug: "kathmandu-handicrafts",
        name: "Kathmandu Handicrafts",
        nameNepali: "काठमाडौं हस्तकला",
        description: "Authentic Nepali handicrafts imported to Japan. Singing bowls, thangka paintings, pashmina, and handmade decor that brings a piece of home to your apartment.",
        category: "handicrafts",
        subcategories: [
            "singing-bowls",
            "thangka",
            "pashmina",
            "decor"
        ],
        coverImage: "https://images.unsplash.com/photo-1590736969955-71cc94901144?w=800&h=400&fit=crop",
        logo: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=200&h=200&fit=crop",
        rating: 4.9,
        reviewCount: 168,
        isOpen: true,
        openingHours: {
            ...defaultHours,
            tuesday: {
                open: "00:00",
                close: "00:00",
                isClosed: true
            }
        },
        location: {
            address: "3-15-2 Ueno",
            area: "Ueno",
            city: "Taito",
            prefecture: "Tokyo",
            postalCode: "110-0005",
            coordinates: {
                lat: 35.7141,
                lng: 139.7774
            }
        },
        contact: {
            phone: "+81-3-4567-8901",
            whatsapp: "+81-90-4567-8901"
        },
        googleMapsTag: "民芸品店",
        googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=35.7141,139.7774",
        onlineStoreUrl: "/shops/kathmandu-handicrafts",
        features: [
            "pickup",
            "delivery",
            "digital-payment"
        ],
        deliveryFee: 700,
        deliveryTime: "2-4 days",
        featured: true
    },
    {
        id: "5",
        slug: "annapurna-grocery-kawaguchi",
        name: "Annapurna Grocery",
        nameNepali: "अन्नपूर्ण किराना",
        description: "Serving the Nepali community of Saitama. Fresh vegetables, halal meat, Nepali spices, and daily essentials. Convenient delivery to Kawaguchi and Warabi.",
        category: "groceries",
        subcategories: [
            "fresh-produce",
            "halal-meat",
            "spices",
            "dairy"
        ],
        coverImage: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800&h=400&fit=crop",
        logo: "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=200&h=200&fit=crop",
        rating: 4.7,
        reviewCount: 256,
        isOpen: true,
        openingHours: defaultHours,
        location: {
            address: "2-4-1 Namiki",
            area: "Nishi-Kawaguchi",
            city: "Kawaguchi",
            prefecture: "Saitama",
            postalCode: "332-0021",
            coordinates: {
                lat: 35.8074,
                lng: 139.6932
            }
        },
        contact: {
            phone: "+81-48-123-4567",
            whatsapp: "+81-90-5678-9012"
        },
        googleMapsTag: "アジア物産",
        googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=35.8074,139.6932",
        onlineStoreUrl: "/shops/annapurna-grocery-kawaguchi",
        features: [
            "delivery",
            "pickup",
            "cash-on-delivery",
            "digital-payment"
        ],
        minOrder: 1500,
        deliveryFee: 450,
        deliveryTime: "Same day (order by 2pm)",
        featured: true
    },
    {
        id: "6",
        slug: "buddha-beauty-store",
        name: "Buddha Beauty & Wellness",
        nameNepali: "बुद्ध ब्युटी स्टोर",
        description: "Natural Himalayan skincare, ayurvedic products, henna, and beauty essentials popular among the Nepali community in Japan.",
        category: "health-beauty",
        subcategories: [
            "skincare",
            "ayurveda",
            "henna",
            "haircare"
        ],
        coverImage: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&h=400&fit=crop",
        logo: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200&h=200&fit=crop",
        rating: 4.7,
        reviewCount: 189,
        isOpen: true,
        openingHours: defaultHours,
        location: {
            address: "1-8-4 Nishi-Nippori",
            area: "Nippori",
            city: "Arakawa",
            prefecture: "Tokyo",
            postalCode: "116-0013",
            coordinates: {
                lat: 35.7281,
                lng: 139.7707
            }
        },
        contact: {
            phone: "+81-3-5678-9012",
            whatsapp: "+81-90-6789-0123"
        },
        googleMapsTag: "化粧品店",
        googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=35.7281,139.7707",
        onlineStoreUrl: "/shops/buddha-beauty-store",
        features: [
            "delivery",
            "pickup",
            "digital-payment"
        ],
        minOrder: 1000,
        deliveryFee: 400,
        deliveryTime: "1-2 days"
    },
    {
        id: "7",
        slug: "sagarmatha-mart-yokohama",
        name: "Sagarmatha Mart",
        nameNepali: "सगरमाथा मार्ट",
        description: "Kanagawa's go-to Nepali and South Asian grocery. Imported snacks, beverages, spices, and frozen Nepali foods. Delivery across Yokohama and Kawasaki.",
        category: "groceries",
        subcategories: [
            "spices",
            "snacks",
            "frozen",
            "beverages"
        ],
        coverImage: "https://images.unsplash.com/photo-1601599963565-b7f49d6c2f1a?w=800&h=400&fit=crop",
        logo: "https://images.unsplash.com/photo-1601599561213-832382fd07ba?w=200&h=200&fit=crop",
        rating: 4.6,
        reviewCount: 203,
        isOpen: true,
        openingHours: defaultHours,
        location: {
            address: "2-16-1 Minamisaiwai",
            area: "Yokohama Station",
            city: "Yokohama",
            prefecture: "Kanagawa",
            postalCode: "220-0011",
            coordinates: {
                lat: 35.4659,
                lng: 139.6224
            }
        },
        contact: {
            phone: "+81-45-123-4567",
            whatsapp: "+81-90-7890-1234"
        },
        googleMapsTag: "アジア物産",
        googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=35.4659,139.6224",
        onlineStoreUrl: "/shops/sagarmatha-mart-yokohama",
        features: [
            "delivery",
            "pickup",
            "cash-on-delivery",
            "digital-payment"
        ],
        minOrder: 1500,
        deliveryFee: 500,
        deliveryTime: "1-2 days"
    },
    {
        id: "8",
        slug: "gorkha-spice-bazaar",
        name: "Gorkha Spice Bazaar",
        nameNepali: "गोर्खा मसला बजार",
        description: "Specialty Nepali spices, pickles, and dry foods. From timur to gundruk, we stock the authentic flavors you can't find in regular Japanese supermarkets.",
        category: "food-beverages",
        subcategories: [
            "spices",
            "achar",
            "dry-foods",
            "tea"
        ],
        coverImage: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&h=400&fit=crop",
        logo: "https://images.unsplash.com/photo-1532336414038-cf19250c5757?w=200&h=200&fit=crop",
        rating: 4.8,
        reviewCount: 145,
        isOpen: true,
        openingHours: defaultHours,
        location: {
            address: "1-5-7 Tsuruhashi",
            area: "Tsuruhashi",
            city: "Ikuno",
            prefecture: "Osaka",
            postalCode: "544-0031",
            coordinates: {
                lat: 34.6648,
                lng: 135.5310
            }
        },
        contact: {
            phone: "+81-6-1234-5678",
            whatsapp: "+81-90-8901-2345"
        },
        googleMapsTag: "ネパール物産店",
        googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=34.6648,135.5310",
        onlineStoreUrl: "/shops/gorkha-spice-bazaar",
        features: [
            "delivery",
            "pickup",
            "digital-payment"
        ],
        minOrder: 1200,
        deliveryFee: 500,
        deliveryTime: "2-3 days"
    },
    {
        id: "9",
        slug: "namaste-mart-nagoya",
        name: "Namaste Mart",
        nameNepali: "नमस्ते मार्ट",
        description: "Aichi's largest Nepali grocery serving the Nagoya community. Rice, lentils, spices, fresh vegetables, and Nepali household items at great prices.",
        category: "groceries",
        subcategories: [
            "rice",
            "lentils",
            "spices",
            "household"
        ],
        coverImage: "https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?w=800&h=400&fit=crop",
        logo: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=200&h=200&fit=crop",
        rating: 4.7,
        reviewCount: 178,
        isOpen: true,
        openingHours: defaultHours,
        location: {
            address: "3-6-1 Sakae",
            area: "Sakae, Nagoya",
            city: "Nagoya",
            prefecture: "Aichi",
            postalCode: "460-0008",
            coordinates: {
                lat: 35.1681,
                lng: 136.9085
            }
        },
        contact: {
            phone: "+81-52-123-4567",
            whatsapp: "+81-90-9012-3456"
        },
        googleMapsTag: "アジア食材店",
        googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=35.1681,136.9085",
        onlineStoreUrl: "/shops/namaste-mart-nagoya",
        features: [
            "delivery",
            "pickup",
            "cash-on-delivery",
            "digital-payment"
        ],
        minOrder: 1500,
        deliveryFee: 500,
        deliveryTime: "1-2 days",
        featured: true
    },
    {
        id: "10",
        slug: "lumbini-jewelers",
        name: "Lumbini Jewelers",
        nameNepali: "लुम्बिनी ज्वेलर्स",
        description: "Traditional Nepali gold and silver jewelry for weddings and festivals. Tilhari, pote, and custom designs for the Nepali community in Japan.",
        category: "jewelry",
        subcategories: [
            "gold",
            "silver",
            "traditional",
            "custom"
        ],
        coverImage: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=400&fit=crop",
        logo: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=200&h=200&fit=crop",
        rating: 4.8,
        reviewCount: 92,
        isOpen: true,
        openingHours: {
            ...defaultHours,
            tuesday: {
                open: "00:00",
                close: "00:00",
                isClosed: true
            }
        },
        location: {
            address: "2-7-3 Hyakunincho",
            area: "Shin-Okubo",
            city: "Shinjuku",
            prefecture: "Tokyo",
            postalCode: "169-0073",
            coordinates: {
                lat: 35.7018,
                lng: 139.6995
            }
        },
        contact: {
            phone: "+81-3-6789-0123",
            whatsapp: "+81-90-0123-4567"
        },
        googleMapsTag: "宝石店",
        googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=35.7018,139.6995",
        onlineStoreUrl: "/shops/lumbini-jewelers",
        features: [
            "pickup",
            "digital-payment"
        ]
    },
    {
        id: "11",
        slug: "pokhara-restaurant-mart",
        name: "Pokhara Restaurant & Mart",
        nameNepali: "पोखरा रेस्टुरेन्ट तथा मार्ट",
        description: "Authentic Nepali thali, momo, and chowmein plus a grocery corner. Order ready meals or stock up on Nepali pantry staples in Warabi.",
        category: "food-beverages",
        subcategories: [
            "ready-to-eat",
            "momo",
            "thali",
            "groceries"
        ],
        coverImage: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=400&fit=crop",
        logo: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&h=200&fit=crop",
        rating: 4.9,
        reviewCount: 334,
        isOpen: true,
        openingHours: {
            ...defaultHours,
            monday: {
                open: "11:00",
                close: "22:30",
                isClosed: false
            },
            tuesday: {
                open: "11:00",
                close: "22:30",
                isClosed: false
            },
            wednesday: {
                open: "11:00",
                close: "22:30",
                isClosed: false
            },
            thursday: {
                open: "11:00",
                close: "22:30",
                isClosed: false
            },
            friday: {
                open: "11:00",
                close: "23:00",
                isClosed: false
            },
            saturday: {
                open: "11:00",
                close: "23:00",
                isClosed: false
            },
            sunday: {
                open: "11:00",
                close: "22:30",
                isClosed: false
            }
        },
        location: {
            address: "1-3-8 Chuo",
            area: "Warabi Station",
            city: "Warabi",
            prefecture: "Saitama",
            postalCode: "335-0004",
            coordinates: {
                lat: 35.8254,
                lng: 139.6800
            }
        },
        contact: {
            phone: "+81-48-234-5678",
            whatsapp: "+81-90-1122-3344"
        },
        googleMapsTag: "ネパール料理店",
        googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=35.8254,139.6800",
        onlineStoreUrl: "/shops/pokhara-restaurant-mart",
        features: [
            "delivery",
            "pickup",
            "cash-on-delivery",
            "digital-payment"
        ],
        minOrder: 1000,
        deliveryFee: 400,
        deliveryTime: "Same day (order by 4pm)"
    },
    {
        id: "12",
        slug: "manakamana-electronics",
        name: "Manakamana Electronics",
        nameNepali: "मनकामना इलेक्ट्रोनिक्स",
        description: "Phones, SIM cards, remittance support, and electronics tailored for the Nepali community in Japan. Nepali-speaking staff to help you get connected.",
        category: "electronics",
        subcategories: [
            "smartphones",
            "sim-cards",
            "accessories",
            "appliances"
        ],
        coverImage: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&h=400&fit=crop",
        logo: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=200&h=200&fit=crop",
        rating: 4.5,
        reviewCount: 167,
        isOpen: true,
        openingHours: defaultHours,
        location: {
            address: "1-10-2 Hyakunincho",
            area: "Shin-Okubo",
            city: "Shinjuku",
            prefecture: "Tokyo",
            postalCode: "169-0073",
            coordinates: {
                lat: 35.7005,
                lng: 139.7010
            }
        },
        contact: {
            phone: "+81-3-7890-1234",
            whatsapp: "+81-90-2233-4455"
        },
        googleMapsTag: "電器店",
        googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=35.7005,139.7010",
        onlineStoreUrl: "/shops/manakamana-electronics",
        features: [
            "delivery",
            "pickup",
            "digital-payment"
        ],
        minOrder: 2000,
        deliveryFee: 600,
        deliveryTime: "2-3 days"
    }
];
function getShopBySlug(slug) {
    return shops.find((shop)=>shop.slug === slug);
}
function getShopById(id) {
    return shops.find((shop)=>shop.id === id);
}
function getShopsByCategory(category) {
    return shops.filter((shop)=>shop.category === category);
}
function getFeaturedShops() {
    return shops.filter((shop)=>shop.featured);
}
function searchShops(query) {
    const lowerQuery = query.toLowerCase();
    return shops.filter((shop)=>shop.name.toLowerCase().includes(lowerQuery) || shop.nameNepali?.includes(query) || shop.description.toLowerCase().includes(lowerQuery) || shop.category.includes(lowerQuery));
}
}),
"[project]/artifacts/shopsaas/lib/mock-data/products.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getFeaturedProducts",
    ()=>getFeaturedProducts,
    "getProductById",
    ()=>getProductById,
    "getProductsByCategory",
    ()=>getProductsByCategory,
    "getProductsByShopId",
    ()=>getProductsByShopId,
    "products",
    ()=>products,
    "searchProducts",
    ()=>searchProducts
]);
const products = [
    // Himalaya Asian Mart (id: 1) - groceries
    {
        id: "p1",
        shopId: "1",
        name: "Wai Wai Noodles (Pack of 5)",
        nameNepali: "वाइ वाइ चाउचाउ",
        description: "The iconic Nepali instant noodles. A taste of home that every Nepali in Japan craves. Pack of 5.",
        price: 450,
        images: [
            "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=400&h=400&fit=crop"
        ],
        category: "snacks",
        inStock: true,
        stockCount: 120,
        unit: "5-pack",
        featured: true
    },
    {
        id: "p2",
        shopId: "1",
        name: "Basmati Rice 5kg",
        nameNepali: "बासमती चामल ५ केजी",
        description: "Premium long-grain aromatic basmati rice. Perfect for biryani, pulao, and everyday dal bhat.",
        price: 2980,
        compareAtPrice: 3400,
        images: [
            "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop"
        ],
        category: "rice",
        inStock: true,
        stockCount: 80,
        unit: "5kg bag",
        featured: true
    },
    {
        id: "p3",
        shopId: "1",
        name: "Masoor Dal (Red Lentils) 1kg",
        nameNepali: "मसुरको दाल १ केजी",
        description: "Premium quality red lentils for authentic Nepali dal. Cooks quickly and tastes just like home.",
        price: 680,
        images: [
            "https://images.unsplash.com/photo-1610725664285-7c57e6eeac3f?w=400&h=400&fit=crop"
        ],
        category: "lentils",
        inStock: true,
        stockCount: 90,
        unit: "1kg"
    },
    {
        id: "p4",
        shopId: "1",
        name: "Nepali Masala Spice Mix",
        nameNepali: "नेपाली मसला",
        description: "Traditional blend of spices for authentic Nepali cooking. Perfect for curries and meat dishes.",
        price: 580,
        images: [
            "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=400&fit=crop"
        ],
        category: "spices",
        inStock: true,
        stockCount: 60,
        unit: "200g",
        featured: true
    },
    {
        id: "p5",
        shopId: "1",
        name: "Frozen Momo Wrappers",
        nameNepali: "मम्म पिठो",
        description: "Ready-to-use momo wrappers. Make authentic Nepali momos at home. 40 pieces per pack.",
        price: 390,
        images: [
            "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=400&fit=crop"
        ],
        category: "frozen",
        inStock: true,
        stockCount: 70,
        unit: "40 pcs"
    },
    // Everest Nepali Kitchen (id: 2) - food
    {
        id: "p6",
        shopId: "2",
        name: "Chicken Momo (Frozen, 20 pcs)",
        nameNepali: "कुखुराको मम्म (२० वटा)",
        description: "Handmade frozen chicken momos. Just steam and enjoy authentic Nepali dumplings at home.",
        price: 1200,
        compareAtPrice: 1400,
        images: [
            "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=400&h=400&fit=crop"
        ],
        category: "momo",
        inStock: true,
        stockCount: 50,
        unit: "20 pcs",
        featured: true
    },
    {
        id: "p7",
        shopId: "2",
        name: "Sel Roti (Pack of 6)",
        nameNepali: "सेल रोटी",
        description: "Traditional ring-shaped sweet rice bread. A festival favorite, made fresh daily.",
        price: 700,
        images: [
            "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=400&fit=crop"
        ],
        category: "sweets",
        inStock: true,
        stockCount: 40,
        unit: "6 pcs"
    },
    {
        id: "p8",
        shopId: "2",
        name: "Chicken Sukuti (Dried Meat) 200g",
        nameNepali: "कुखुराको सुकुटी",
        description: "Spicy Nepali dried chicken. A perfect snack with cold drinks. Packed fresh.",
        price: 1500,
        images: [
            "https://images.unsplash.com/photo-1606851091851-e8c8c0fca5ba?w=400&h=400&fit=crop"
        ],
        category: "ready-to-eat",
        inStock: true,
        stockCount: 30,
        unit: "200g",
        featured: true
    },
    // Nepal Fashion House (id: 3) - fashion
    {
        id: "p9",
        shopId: "3",
        name: "Daura Suruwal Set",
        nameNepali: "दौरा सुरुवाल सेट",
        description: "Traditional Nepali formal wear for men. Includes daura, suruwal, and topi. Perfect for Dashain and weddings.",
        price: 12800,
        compareAtPrice: 14500,
        images: [
            "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=400&fit=crop"
        ],
        category: "traditional",
        inStock: true,
        stockCount: 15,
        variants: [
            {
                id: "v1",
                name: "Small",
                price: 12800,
                inStock: true
            },
            {
                id: "v2",
                name: "Medium",
                price: 12800,
                inStock: true
            },
            {
                id: "v3",
                name: "Large",
                price: 12800,
                inStock: true
            },
            {
                id: "v4",
                name: "XL",
                price: 13500,
                inStock: false
            }
        ],
        featured: true
    },
    {
        id: "p10",
        shopId: "3",
        name: "Dhaka Topi",
        nameNepali: "ढाका टोपी",
        description: "Authentic Dhaka topi handwoven in Nepal. A symbol of Nepali pride to wear at festivals and events.",
        price: 2400,
        images: [
            "https://images.unsplash.com/photo-1521369909029-2afed882baee?w=400&h=400&fit=crop"
        ],
        category: "accessories",
        inStock: true,
        stockCount: 40
    },
    {
        id: "p11",
        shopId: "3",
        name: "Pashmina Shawl",
        nameNepali: "पश्मिना शल",
        description: "Luxurious 100% cashmere pashmina shawl, handwoven in Nepal. Warm and elegant for Japanese winters.",
        price: 9800,
        images: [
            "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=400&h=400&fit=crop"
        ],
        category: "accessories",
        inStock: true,
        stockCount: 25,
        featured: true
    },
    // Kathmandu Handicrafts (id: 4) - handicrafts
    {
        id: "p12",
        shopId: "4",
        name: "Tibetan Singing Bowl",
        nameNepali: "तिब्बती गायन कटोरा",
        description: "Hand-hammered brass singing bowl for meditation and relaxation. Includes wooden mallet and cushion.",
        price: 8500,
        images: [
            "https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=400&h=400&fit=crop"
        ],
        category: "singing-bowls",
        inStock: true,
        stockCount: 20,
        featured: true
    },
    {
        id: "p13",
        shopId: "4",
        name: "Thangka Painting - Buddha",
        nameNepali: "थाङ्का चित्र - बुद्ध",
        description: "Hand-painted thangka of Buddha. Natural mineral colors on cotton canvas. A beautiful piece of home.",
        price: 38000,
        images: [
            "https://images.unsplash.com/photo-1609710228159-0fa9bd7c0827?w=400&h=400&fit=crop"
        ],
        category: "thangka",
        inStock: true,
        stockCount: 8
    },
    {
        id: "p14",
        shopId: "4",
        name: "Wooden Prayer Wheel",
        nameNepali: "काठको माने",
        description: "Traditional Buddhist prayer wheel with mantras. Handcrafted wood and brass.",
        price: 4800,
        images: [
            "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop"
        ],
        category: "decor",
        inStock: true,
        stockCount: 15
    },
    // Annapurna Grocery (id: 5) - groceries
    {
        id: "p15",
        shopId: "5",
        name: "Halal Goat Meat (Fresh) 1kg",
        nameNepali: "खसीको मासु १ केजी",
        description: "Fresh halal goat meat, cut to order. Perfect for khasi ko masu and festive feasts.",
        price: 2800,
        images: [
            "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400&h=400&fit=crop"
        ],
        category: "halal-meat",
        inStock: true,
        stockCount: 30,
        unit: "1kg",
        featured: true
    },
    {
        id: "p16",
        shopId: "5",
        name: "Fresh Coriander & Green Chili Set",
        nameNepali: "धनिया र खुर्सानी",
        description: "Fresh coriander leaves and green chilies. Essential for authentic Nepali cooking.",
        price: 380,
        images: [
            "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&h=400&fit=crop"
        ],
        category: "fresh-produce",
        inStock: true,
        stockCount: 45,
        unit: "set"
    },
    // Buddha Beauty & Wellness (id: 6) - health-beauty
    {
        id: "p17",
        shopId: "6",
        name: "Himalayan Herbal Face Serum",
        nameNepali: "हिमालयन फेस सीरम",
        description: "Natural anti-aging serum with Himalayan herbs. Brightens and hydrates skin in dry Japanese weather.",
        price: 2980,
        images: [
            "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop"
        ],
        category: "skincare",
        inStock: true,
        stockCount: 30,
        featured: true
    },
    {
        id: "p18",
        shopId: "6",
        name: "Natural Henna (Mehendi) Cones",
        nameNepali: "मेहन्दी",
        description: "Set of 4 natural henna cones for festivals and weddings. Rich, dark color.",
        price: 890,
        images: [
            "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&h=400&fit=crop"
        ],
        category: "henna",
        inStock: true,
        stockCount: 45
    },
    // Sagarmatha Mart (id: 7) - groceries
    {
        id: "p19",
        shopId: "7",
        name: "Frozen Buff Momo (20 pcs)",
        nameNepali: "रांगाको मम्म",
        description: "Authentic frozen buff momos. Steam at home for a true taste of Kathmandu.",
        price: 1300,
        images: [
            "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400&h=400&fit=crop"
        ],
        category: "frozen",
        inStock: true,
        stockCount: 40,
        unit: "20 pcs",
        featured: true
    },
    {
        id: "p20",
        shopId: "7",
        name: "Tongba (Millet Drink) Kit",
        nameNepali: "तोङ्बा",
        description: "Traditional fermented millet drink kit with bamboo tongba container. A Himalayan favorite.",
        price: 3200,
        images: [
            "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=400&h=400&fit=crop"
        ],
        category: "beverages",
        inStock: true,
        stockCount: 12
    },
    // Gorkha Spice Bazaar (id: 8) - food/spices
    {
        id: "p21",
        shopId: "8",
        name: "Timur (Sichuan Pepper) 100g",
        nameNepali: "टिमुर",
        description: "Aromatic Nepali timur pepper. The secret to authentic pickle and momo achar.",
        price: 980,
        compareAtPrice: 1200,
        images: [
            "https://images.unsplash.com/photo-1599909533730-f9ba0a3b7d6e?w=400&h=400&fit=crop"
        ],
        category: "spices",
        inStock: true,
        stockCount: 50,
        unit: "100g",
        featured: true
    },
    {
        id: "p22",
        shopId: "8",
        name: "Gundruk (Fermented Greens) 200g",
        nameNepali: "गुन्द्रुक",
        description: "Traditional fermented leafy greens. Make authentic gundruk ko jhol and achar.",
        price: 750,
        images: [
            "https://images.unsplash.com/photo-1591287083773-9a52cc8c7c0a?w=400&h=400&fit=crop"
        ],
        category: "dry-foods",
        inStock: true,
        stockCount: 35,
        unit: "200g"
    },
    // Namaste Mart (id: 9) - groceries
    {
        id: "p23",
        shopId: "9",
        name: "Mustard Oil (Tori ko Tel) 1L",
        nameNepali: "तोरीको तेल",
        description: "Pure Nepali mustard oil. The authentic base for Nepali cooking and pickles.",
        price: 980,
        images: [
            "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=400&fit=crop"
        ],
        category: "household",
        inStock: true,
        stockCount: 60,
        unit: "1L",
        featured: true
    },
    {
        id: "p24",
        shopId: "9",
        name: "Beaten Rice (Chiura) 1kg",
        nameNepali: "चिउरा",
        description: "Traditional beaten rice. Perfect with curd, achar, and for festivals like Tihar.",
        price: 620,
        images: [
            "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop"
        ],
        category: "rice",
        inStock: true,
        stockCount: 50,
        unit: "1kg"
    },
    {
        id: "p25",
        shopId: "9",
        name: "Black Lentils (Kalo Dal) 1kg",
        nameNepali: "कालो दाल",
        description: "Whole black lentils for maas ko dal. A protein-rich Nepali staple.",
        price: 780,
        images: [
            "https://images.unsplash.com/photo-1610725664285-7c57e6eeac3f?w=400&h=400&fit=crop"
        ],
        category: "lentils",
        inStock: true,
        stockCount: 55,
        unit: "1kg"
    },
    // Lumbini Jewelers (id: 10) - jewelry
    {
        id: "p26",
        shopId: "10",
        name: "Pote (Glass Bead Necklace)",
        nameNepali: "पोते",
        description: "Traditional green glass bead necklace, a symbol of marriage. Available in classic colors.",
        price: 3800,
        images: [
            "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=400&fit=crop"
        ],
        category: "traditional",
        inStock: true,
        stockCount: 25,
        featured: true
    },
    {
        id: "p27",
        shopId: "10",
        name: "Gold-Plated Tilhari",
        nameNepali: "तिलहरी",
        description: "Traditional Nepali tilhari pendant for pote. Essential bridal and festival jewelry.",
        price: 18500,
        images: [
            "https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=400&h=400&fit=crop"
        ],
        category: "gold",
        inStock: true,
        stockCount: 8
    },
    // Pokhara Restaurant & Mart (id: 11) - food
    {
        id: "p28",
        shopId: "11",
        name: "Nepali Thali Set (Ready Meal)",
        nameNepali: "नेपाली थाली सेट",
        description: "Complete dal bhat thali with rice, dal, vegetable curry, and achar. Heat and eat.",
        price: 1100,
        compareAtPrice: 1300,
        images: [
            "https://images.unsplash.com/photo-1567337710282-00832b415979?w=400&h=400&fit=crop"
        ],
        category: "thali",
        inStock: true,
        stockCount: 30,
        featured: true
    },
    {
        id: "p29",
        shopId: "11",
        name: "Chicken Chowmein (Ready Meal)",
        nameNepali: "कुखुरा चाउमिन",
        description: "Nepali-style stir-fried noodles with chicken and vegetables. A diaspora favorite.",
        price: 850,
        images: [
            "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&h=400&fit=crop"
        ],
        category: "ready-to-eat",
        inStock: true,
        stockCount: 35
    },
    {
        id: "p30",
        shopId: "11",
        name: "Veg Momo (Frozen, 20 pcs)",
        nameNepali: "तरकारी मम्म",
        description: "Vegetable momos made fresh and frozen. Steam at home for a quick comfort meal.",
        price: 1000,
        images: [
            "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=400&h=400&fit=crop"
        ],
        category: "momo",
        inStock: true,
        stockCount: 40
    },
    // Manakamana Electronics (id: 12) - electronics
    {
        id: "p31",
        shopId: "12",
        name: "Japan Prepaid SIM Card",
        nameNepali: "जापान सिम कार्ड",
        description: "Data + calls prepaid SIM with Nepali-language support. Easy setup for newcomers to Japan.",
        price: 3000,
        images: [
            "https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?w=400&h=400&fit=crop"
        ],
        category: "sim-cards",
        inStock: true,
        stockCount: 100,
        featured: true
    },
    {
        id: "p32",
        shopId: "12",
        name: "Wireless Earbuds Pro",
        nameNepali: "वायरलेस इयरबड्स",
        description: "Active noise cancellation with 24-hour battery. Great for commutes on the Yamanote line.",
        price: 6800,
        images: [
            "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=400&fit=crop"
        ],
        category: "accessories",
        inStock: true,
        stockCount: 35
    },
    {
        id: "p33",
        shopId: "12",
        name: "USB-C Fast Charger 65W",
        nameNepali: "फास्ट चार्जर",
        description: "Universal fast charger compatible with laptops and phones. Japanese plug type.",
        price: 3200,
        images: [
            "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400&h=400&fit=crop"
        ],
        category: "accessories",
        inStock: true,
        stockCount: 50
    }
];
function getProductById(id) {
    return products.find((product)=>product.id === id);
}
function getProductsByShopId(shopId) {
    return products.filter((product)=>product.shopId === shopId);
}
function getFeaturedProducts() {
    return products.filter((product)=>product.featured);
}
function searchProducts(query) {
    const lowerQuery = query.toLowerCase();
    return products.filter((product)=>product.name.toLowerCase().includes(lowerQuery) || product.nameNepali?.includes(query) || product.description.toLowerCase().includes(lowerQuery) || product.category.toLowerCase().includes(lowerQuery));
}
function getProductsByCategory(shopId, category) {
    return products.filter((product)=>product.shopId === shopId && product.category === category);
}
}),
"[project]/artifacts/shopsaas/components/ui/tabs.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Tabs",
    ()=>Tabs,
    "TabsContent",
    ()=>TabsContent,
    "TabsList",
    ()=>TabsList,
    "TabsTrigger",
    ()=>TabsTrigger
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.2.6_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const Tabs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call Tabs() from the server but Tabs is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/artifacts/shopsaas/components/ui/tabs.tsx <module evaluation>", "Tabs");
const TabsContent = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call TabsContent() from the server but TabsContent is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/artifacts/shopsaas/components/ui/tabs.tsx <module evaluation>", "TabsContent");
const TabsList = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call TabsList() from the server but TabsList is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/artifacts/shopsaas/components/ui/tabs.tsx <module evaluation>", "TabsList");
const TabsTrigger = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call TabsTrigger() from the server but TabsTrigger is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/artifacts/shopsaas/components/ui/tabs.tsx <module evaluation>", "TabsTrigger");
}),
"[project]/artifacts/shopsaas/components/ui/tabs.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Tabs",
    ()=>Tabs,
    "TabsContent",
    ()=>TabsContent,
    "TabsList",
    ()=>TabsList,
    "TabsTrigger",
    ()=>TabsTrigger
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.2.6_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const Tabs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call Tabs() from the server but Tabs is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/artifacts/shopsaas/components/ui/tabs.tsx", "Tabs");
const TabsContent = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call TabsContent() from the server but TabsContent is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/artifacts/shopsaas/components/ui/tabs.tsx", "TabsContent");
const TabsList = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call TabsList() from the server but TabsList is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/artifacts/shopsaas/components/ui/tabs.tsx", "TabsList");
const TabsTrigger = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call TabsTrigger() from the server but TabsTrigger is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/artifacts/shopsaas/components/ui/tabs.tsx", "TabsTrigger");
}),
"[project]/artifacts/shopsaas/components/ui/tabs.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$artifacts$2f$shopsaas$2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/artifacts/shopsaas/components/ui/tabs.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$artifacts$2f$shopsaas$2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/artifacts/shopsaas/components/ui/tabs.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$artifacts$2f$shopsaas$2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/artifacts/shopsaas/app/shops/[slug]/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ShopPage,
    "generateMetadata",
    ()=>generateMetadata
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.2.6_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$api$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.2.6_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/api/navigation.react-server.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.2.6_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/client/components/navigation.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$artifacts$2f$shopsaas$2f$components$2f$shops$2f$shop$2d$hero$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/artifacts/shopsaas/components/shops/shop-hero.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$artifacts$2f$shopsaas$2f$components$2f$products$2f$product$2d$grid$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/artifacts/shopsaas/components/products/product-grid.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$artifacts$2f$shopsaas$2f$lib$2f$mock$2d$data$2f$shops$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/artifacts/shopsaas/lib/mock-data/shops.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$artifacts$2f$shopsaas$2f$lib$2f$mock$2d$data$2f$products$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/artifacts/shopsaas/lib/mock-data/products.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$artifacts$2f$shopsaas$2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/artifacts/shopsaas/components/ui/tabs.tsx [app-rsc] (ecmascript)");
;
;
;
;
;
;
;
async function generateMetadata({ params }) {
    const { slug } = await params;
    const shop = (0, __TURBOPACK__imported__module__$5b$project$5d2f$artifacts$2f$shopsaas$2f$lib$2f$mock$2d$data$2f$shops$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getShopBySlug"])(slug);
    if (!shop) {
        return {
            title: "Shop Not Found"
        };
    }
    return {
        title: `${shop.name} - ShopSaaS`,
        description: shop.description
    };
}
async function ShopPage({ params }) {
    const { slug } = await params;
    const shop = (0, __TURBOPACK__imported__module__$5b$project$5d2f$artifacts$2f$shopsaas$2f$lib$2f$mock$2d$data$2f$shops$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getShopBySlug"])(slug);
    if (!shop) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["notFound"])();
    }
    const products = (0, __TURBOPACK__imported__module__$5b$project$5d2f$artifacts$2f$shopsaas$2f$lib$2f$mock$2d$data$2f$products$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getProductsByShopId"])(shop.id);
    // Get unique categories from products
    const productCategories = Array.from(new Set(products.map((p)=>p.category))).sort();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$artifacts$2f$shopsaas$2f$components$2f$shops$2f$shop$2d$hero$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ShopHero"], {
                shop: shop
            }, void 0, false, {
                fileName: "[project]/artifacts/shopsaas/app/shops/[slug]/page.tsx",
                lineNumber: 45,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "container px-4 py-8",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between mb-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-xl font-bold md:text-2xl",
                                children: "Products"
                            }, void 0, false, {
                                fileName: "[project]/artifacts/shopsaas/app/shops/[slug]/page.tsx",
                                lineNumber: 49,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-muted-foreground",
                                children: [
                                    products.length,
                                    " product",
                                    products.length !== 1 ? "s" : ""
                                ]
                            }, void 0, true, {
                                fileName: "[project]/artifacts/shopsaas/app/shops/[slug]/page.tsx",
                                lineNumber: 50,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/artifacts/shopsaas/app/shops/[slug]/page.tsx",
                        lineNumber: 48,
                        columnNumber: 9
                    }, this),
                    productCategories.length > 1 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$artifacts$2f$shopsaas$2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Tabs"], {
                        defaultValue: "all",
                        className: "w-full",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$artifacts$2f$shopsaas$2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TabsList"], {
                                className: "w-full justify-start overflow-x-auto flex-nowrap mb-6",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$artifacts$2f$shopsaas$2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TabsTrigger"], {
                                        value: "all",
                                        children: "All"
                                    }, void 0, false, {
                                        fileName: "[project]/artifacts/shopsaas/app/shops/[slug]/page.tsx",
                                        lineNumber: 58,
                                        columnNumber: 15
                                    }, this),
                                    productCategories.map((category)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$artifacts$2f$shopsaas$2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TabsTrigger"], {
                                            value: category,
                                            className: "capitalize",
                                            children: category.replace("-", " ")
                                        }, category, false, {
                                            fileName: "[project]/artifacts/shopsaas/app/shops/[slug]/page.tsx",
                                            lineNumber: 60,
                                            columnNumber: 17
                                        }, this))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/artifacts/shopsaas/app/shops/[slug]/page.tsx",
                                lineNumber: 57,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$artifacts$2f$shopsaas$2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TabsContent"], {
                                value: "all",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$artifacts$2f$shopsaas$2f$components$2f$products$2f$product$2d$grid$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ProductGrid"], {
                                    products: products,
                                    shopSlug: shop.slug
                                }, void 0, false, {
                                    fileName: "[project]/artifacts/shopsaas/app/shops/[slug]/page.tsx",
                                    lineNumber: 67,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/artifacts/shopsaas/app/shops/[slug]/page.tsx",
                                lineNumber: 66,
                                columnNumber: 13
                            }, this),
                            productCategories.map((category)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$artifacts$2f$shopsaas$2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TabsContent"], {
                                    value: category,
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$artifacts$2f$shopsaas$2f$components$2f$products$2f$product$2d$grid$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ProductGrid"], {
                                        products: products.filter((p)=>p.category === category),
                                        shopSlug: shop.slug
                                    }, void 0, false, {
                                        fileName: "[project]/artifacts/shopsaas/app/shops/[slug]/page.tsx",
                                        lineNumber: 72,
                                        columnNumber: 17
                                    }, this)
                                }, category, false, {
                                    fileName: "[project]/artifacts/shopsaas/app/shops/[slug]/page.tsx",
                                    lineNumber: 71,
                                    columnNumber: 15
                                }, this))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/artifacts/shopsaas/app/shops/[slug]/page.tsx",
                        lineNumber: 56,
                        columnNumber: 11
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$artifacts$2f$shopsaas$2f$components$2f$products$2f$product$2d$grid$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ProductGrid"], {
                        products: products,
                        shopSlug: shop.slug
                    }, void 0, false, {
                        fileName: "[project]/artifacts/shopsaas/app/shops/[slug]/page.tsx",
                        lineNumber: 80,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/artifacts/shopsaas/app/shops/[slug]/page.tsx",
                lineNumber: 47,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/artifacts/shopsaas/app/shops/[slug]/page.tsx",
        lineNumber: 44,
        columnNumber: 5
    }, this);
}
}),
"[project]/artifacts/shopsaas/app/shops/[slug]/page.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/artifacts/shopsaas/app/shops/[slug]/page.tsx [app-rsc] (ecmascript)"));
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0xo~st6._.js.map