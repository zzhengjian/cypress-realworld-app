import { test, expect } from '@playwright/experimental-ct-react';
import Footer from './Footer';
import React from 'react';

test('should work', async ({ mount }) => {
  const component = await mount(<Footer />);
  await expect(component).toContainText('Built by');
});