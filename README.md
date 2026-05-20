# Infinite Todo List

Тестовое приложение для ревью и доработки. Проект запускается локально и имитирует бесконечный todo-list с поиском, фильтрацией и формой создания элемента.

Стек:

- React 19
- React Router 7
- Vite
- TypeScript
- собственный UI-kit
- MSW
- Yup
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

Нужно проревьювить приложение как production-код, найти и исправить баги, ошибки обработки состояний, неправильное использование React, проблемы архитектуры, типизации и недоработки UX.

Фокус задания: React-состояние, эффекты, бесконечная подгрузка, optimistic UI и форма без React Hook Form.

MSW полностью эмулирует backend в dev-режиме, отдельный backend запускать не нужно.
