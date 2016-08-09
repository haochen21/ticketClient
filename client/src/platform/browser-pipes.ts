/*
 * These are globally available pipes in any template
 */

import { PLATFORM_PIPES } from '@angular/core';

import { CartStatusFormatPipe } from '../pipe/CartStatus.pipe';
import { DateFormatPipe } from '../pipe/DateFormat.pipe';
import { MapToIterable } from '../pipe/MapToIterable.pipe';
import { NumberFormatPipe } from '../pipe/NumberFormat.pipe';

// application_pipes: pipes that are global through out the application
export const APPLICATION_PIPES = [
  CartStatusFormatPipe,
  DateFormatPipe,
  MapToIterable,
  NumberFormatPipe
];

export const PIPES = [
  { provide: PLATFORM_PIPES, multi: true, useValue: APPLICATION_PIPES }
];
