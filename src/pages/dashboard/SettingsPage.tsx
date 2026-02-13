import { Card } from '../../components';
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { setTheme } from '../../store/themeSlice';
import { Button } from '../../components';
import type { ThemeMode } from '../../types';
import type { JSX } from 'react';

const SettingsPage = (): JSX.Element => {
  const { mode } = useAppSelector((state) => state.theme);
  const dispatch = useAppDispatch();

  const handleThemeChange = (newMode: ThemeMode): void => {
    dispatch(setTheme(newMode));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-gradient-brand text-3xl font-bold tracking-tight">Settings</h1>
        <p className="mt-2 text-base font-medium text-gray-600 dark:text-gray-400">
          Manage your application settings and preferences.
        </p>
      </div>

      <Card title="Appearance">
        <div className="space-y-4">
          <div>
            <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Theme</p>
            <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
              Choose your preferred theme mode.
            </p>
            <div className="flex space-x-4">
              <Button
                variant={mode === 'light' ? 'primary' : 'outline'}
                onClick={() => handleThemeChange('light')}
              >
                Light
              </Button>
              <Button
                variant={mode === 'dark' ? 'primary' : 'outline'}
                onClick={() => handleThemeChange('dark')}
              >
                Dark
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <Card title="Account">
        <div className="space-y-4">
          <div>
            <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Account Information
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Manage your account settings and preferences from the Profile page.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SettingsPage;
