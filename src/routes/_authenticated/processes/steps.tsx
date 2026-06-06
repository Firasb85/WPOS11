import { createFileRoute, redirect } from '@tanstack/react-router';
export const Route = createFileRoute('/_authenticated/processes/steps')({ component: () => null, beforeLoad: () => { throw redirect({ to: '/processes/library' }); } });
