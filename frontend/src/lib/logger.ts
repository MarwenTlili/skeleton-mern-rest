export const logger = (message: string, data?: any) => {
  const now = new Date().toLocaleString();
  console.info(`${now} - ${message} `, data || '');
}
