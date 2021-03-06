import { Response, Request } from 'miragejs';
import { handleErrors } from '../server';
import { Diary } from '../../../interfaces/diary.interface';
import { Entry } from '../../../interfaces/entry.interface';
import dayjs from 'dayjs';
import { User } from '../../../interfaces/user.interface';

export const addEntry = (
    schema: any,
    req: Request
  ): { diary: Diary; entry: Entry } | Response => {
    try {
      const diary = schema.diaries.find(req.params.id);
      const { title, content } = JSON.parse(req.requestBody) as Partial<Entry>;
      const now = dayjs().format();
      const entry = diary.createEntry({
        title,
        content,
        createdAt: now,
        updatedAt: now,
      });
      diary.update({
        ...diary.attrs,
        updatedAt: now,
      });
      return {
        diary: diary.attrs,
        entry: entry.attrs,
      };
    } catch (error) {
      return handleErrors(error, 'Failed to save entry.');
    }
  };
  
  export const getEntries = (
    schema: any,
    req: Request
  ): { entries: Entry[] } | Response => {
    try {
      const diary = schema.diaries.find(req.params.id);
      return diary.entry;
    } catch (error) {
      return handleErrors(error, 'Failed to get Diary entries.');
    }
  };
  
  export const updateEntry = (schema: any, req: Request): Entry | Response => {
    try {
      const entry = schema.entries.find(req.params.id);
      const data = JSON.parse(req.requestBody) as Partial<Entry>;
      const now = dayjs().format();
      entry.update({
        ...data,
        updatedAt: now,
      });
      return entry.attrs as Entry;
    } catch (error) {
      return handleErrors(error, 'Failed to update entry.');
    }
  };