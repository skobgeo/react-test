# Client Directory

Тестовое приложение для ревью и доработки. Проект запускается локально и имитирует каталог клиентов с фильтрами, деталкой, созданием, редактированием и бесконечной подгрузкой списка.

Стек:

- React 19
- React Router 7
- Vite
- TypeScript
- Mantine UI
- Axios
- MSW
- React Hook Form
- Zod
- Biome

Код разложен по Feature-Sliced Design: `app`, `pages`, `widgets`, `features`, `entities`, `shared`.

## Запуск

```bash
npm install
npm run dev
```

## Проверки

```bash
npm run lint
npm run build
```

## Задача

Нужно проревьювить приложение как production-код, найти и исправить баги, ошибки обработки состояний, неправильное использование React, проблемы архитектуры и недоработки UX.

MSW полностью эмулирует backend в dev-режиме, отдельный backend запускать не нужно.
