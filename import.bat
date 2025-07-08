@echo off
:: This script is intended to rebuild the Angular and JS libraries in the project.
:: It excludes the spartan-ng components.

:: libs/pages
pnpm nx g @nx/angular:library --name=billing-sheet-create --directory=libs/pages/billing-sheet-create --publishable --importPath=@mer-pages/billing-sheet-create --unitTestRunner=vitest
pnpm nx g @nx/angular:library --name=billing-sheet-edit --directory=libs/pages/billing-sheet-edit --publishable --importPath=@mer-pages/billing-sheet-edit --unitTestRunner=vitest
pnpm nx g @nx/angular:library --name=billing-sheet-print --directory=libs/pages/billing-sheet-print --publishable --importPath=@mer-pages/billing-sheet-print --unitTestRunner=vitest
pnpm nx g @nx/angular:library --name=daily-report-print --directory=libs/pages/daily-report-print --publishable --importPath=@mer-pages/daily-report-print --unitTestRunner=vitest
pnpm nx g @nx/angular:library --name=daily-report-view --directory=libs/pages/daily-report-view --publishable --importPath=@mer-pages/daily-report-view --unitTestRunner=vitest
pnpm nx g @nx/angular:library --name=dashboard --directory=libs/pages/dashboard --publishable --importPath=@mer-pages/dashboard --unitTestRunner=vitest
pnpm nx g @nx/angular:library --name=login --directory=libs/pages/login --publishable --importPath=@mer-pages/login --unitTestRunner=vitest
pnpm nx g @nx/angular:library --name=registration --directory=libs/pages/registration --publishable --importPath=@mer-pages/registration --unitTestRunner=vitest

:: libs/mer-ui
pnpm nx g @nx/angular:library --name=common --directory=libs/mer-ui/common --publishable --importPath=@mer-ui/common --unitTestRunner=vitest
pnpm nx g @nx/angular:library --name=cpt-select-dialog --directory=libs/mer-ui/form/cpt-select-dialog --publishable --importPath=@mer-ui/form/cpt-select-dialog --unitTestRunner=vitest
pnpm nx g @nx/angular:library --name=ui-header --directory=libs/mer-ui/ui-header --publishable --importPath=@mer-ui/ui-header --unitTestRunner=vitest
pnpm nx g @nx/angular:library --name=ui-input-text-field --directory=libs/mer-ui/ui-input-text-field --publishable --importPath=@mer-ui/ui-input-text-field --unitTestRunner=vitest
pnpm nx g @nx/angular:library --name=ui-input-typeahead-field --directory=libs/mer-ui/ui-input-typeahead-field --publishable --importPath=@mer-ui/ui-input-typeahead-field --unitTestRunner=vitest
pnpm nx g @nx/angular:library --name=ui-page-wrapper --directory=libs/mer-ui/ui-page-wrapper --publishable --importPath=@mer-ui/ui-page-wrapper --unitTestRunner=vitest
pnpm nx g @nx/angular:library --name=ui-radio-group --directory=libs/mer-ui/ui-radio-group --publishable --importPath=@mer-ui/ui-radio-group --unitTestRunner=vitest

:: libs/services
pnpm nx g @nx/angular:library --name=mer-services --directory=libs/services/mer-services --publishable --importPath=@mer/services --unitTestRunner=vitest

:: libs/types - This is a JS library
pnpm nx g @nx/js:library --name=types --directory=libs/types --tags=scope:mer-types --publishable --importPath=@mer/types --unitTestRunner=vitest --bundler=swc --linter=eslint

:: electron-api-types - This is a JS library
pnpm nx g @nx/js:library --name=electron-api-types --directory=electron-api-types --publishable --importPath=electron-api-types --unitTestRunner=vitest --bundler=swc --linter=eslint
