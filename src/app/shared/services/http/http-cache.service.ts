/****************************************************************************
 **
 ** Author: Justus Muoka
 **
 ****************************************************************************/

import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// import { each } from 'lodash-es';
import { Logger } from '../logger/logger.service';
import {each} from "chart.js/helpers";

const cachePersistenceKey = 'httpCache';

/**
 * HttpCacheEntry is the type of the object stored as a value in the cache.
 * It contains the last update date and the data itself.
 */
export interface HttpCacheEntry {
  lastUpdated: Date;
  data: HttpResponse<any>;
}

const log = new Logger('HttpCacheService');

/**
 * @description HttpCacheService is a service that provides a cache for HTTP requests.
 * It can be used to cache GET requests and to retrieve the cached data for subsequent requests.
 * The cache can be persisted in the local or session storage, or it can be only in-memory.
 */
@Injectable()
export class HttpCacheService {
  private cachedData: { [key: string]: HttpCacheEntry } = {};
  private storage: Storage | null = null;

  constructor() {
    this.loadCacheData();
  }

  /**
   * Sets the cache data for the specified request.
   * @param {!string} url The request URL.
   * @param {HttpResponse} data The received data.
   * @param {Date=} lastUpdated The cache last update, current date is used if not specified.
   */
  setCacheData(url: string, data: HttpResponse<any>, lastUpdated?: Date) {
    this.cachedData[url] = {
      lastUpdated: lastUpdated || new Date(),
      data: data,
    };
    log.info(`Cache set for key: "${url}"`);
    this.saveCacheData();
  }

  /**
   * Gets the cached data for the specified request.
   * @param {!string} url The request URL.
   * @return {HttpResponse} The cached data or null if no cached data exists for this request.
   */
  getCacheData(url: string): HttpResponse<any> | null {
    log.info(`Getting cache for [${url}]`);
    const cacheEntry = this.cachedData[url];

    if (cacheEntry) {
      log.info(`Cache hit for key: "${url}"`);
      return cacheEntry.data;
    }

    return null;
  }

  /**
   * Gets the cached entry for the specified request.
   * @param {!string} url The request URL.
   * @return {?HttpCacheEntry} The cache entry or null if no cache entry exists for this request.
   */
  getHttpCacheEntry(url: string): HttpCacheEntry | null {
    return this.cachedData[url] || null;
  }

  /**
   * Clears the cached entry (if exists) for the specified request.
   * @param {!string} url The request URL.
   */
  clearCache(url: string): void {
    delete this.cachedData[url];
    log.info(`Cache cleared for key: "${url}"`);
    this.saveCacheData();
  }

  /**
   * Cleans cache entries older than the specified date.
   * @param {date=} expirationDate The cache expiration date. If no date is specified, all cache is cleared.
   */
  cleanCache(expirationDate?: Date) {
    if (expirationDate) {
      each(this.cachedData, (value: HttpCacheEntry, key: string) => {
        if (expirationDate >= value.lastUpdated) {
          delete this.cachedData[key];
        }
      });
    } else {
      this.cachedData = {};
    }
    this.saveCacheData();
  }

  /**
   * Sets the cache persistence policy.
   * Note that changing the cache persistence will also clear the cache from its previous storage.
   * @param {'local'|'session'=} persistence How the cache should be persisted, it can be either local or session
   *   storage, or if no value is provided it will be only in-memory (default).
   */
  setPersistence(persistence?: 'local' | 'session') {
    this.cleanCache();
    this.storage =
      persistence === 'local' || persistence === 'session'
        ? window[persistence + 'Storage']
        : null;
    this.loadCacheData();
  }

  /**
   * Saves the cache data to the storage.
   * @private
   */
  private saveCacheData() {
    if (this.storage) {
      log.info(`Saving cache ${JSON.stringify(this.cachedData)}`);
      this.storage[cachePersistenceKey] = JSON.stringify(this.cachedData);
    }
  }

  /**
   * Loads the cache data from the storage.
   * @private
   */
  private loadCacheData() {
    const data = this.storage ? this.storage[cachePersistenceKey] : null;
    this.cachedData = data ? JSON.parse(data) : {};
  }
}
