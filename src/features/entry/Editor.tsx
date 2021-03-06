import React, { FC, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../rootReducer';
import Markdown from 'markdown-to-jsx';
import http from '../../services/api';
import { Entry } from '../../interfaces/entry.interface';
import { Diary } from '../../interfaces/diary.interface';
import { setCurrentlyEditing, setCanEdit } from './editorSlice';
import { updateDiary } from '../diary/diariesSlice';
import { updateEntry } from './entriesSlice';
import { showAlert } from '../../util';
import { useAppDispatch } from '../../store';
import { ColorButton } from '../../styles/ColorButton';
import EditIcon from '@material-ui/icons/Edit';
import TextField from '@material-ui/core/TextField';

const Editor: FC = () => {
  const { currentlyEditing: entry, canEdit, activeDiaryId } = useSelector(
    (state: RootState) => state.editor
  );
  const [editedEntry, updateEditedEntry] = useState(entry);
  const dispatch = useAppDispatch();

  const saveEntry = async () => {
    if (activeDiaryId == null) {
      return showAlert('Please select a diary.', 'warning');
    }
    if (entry == null) {
      http
        .post<Entry, { diary: Diary; entry: Entry }>(
          `/diaries/entry/${activeDiaryId}`,
          editedEntry
        )
        .then((data) => {
          if (data != null) {
            const { diary, entry: _entry } = data;
            dispatch(setCurrentlyEditing(_entry));
            dispatch(updateDiary(diary));
          }
        });
    } else {
      http
        .put<Entry, Entry>(`diaries/entry/${entry.id}`, editedEntry)
        .then((_entry) => {
          if (_entry != null) {
            dispatch(setCurrentlyEditing(_entry));
            dispatch(updateEntry(_entry));
          }
        });
    }
    dispatch(setCanEdit(false));
  };

  useEffect(() => {
    updateEditedEntry(entry);
  }, [entry]);

  return (
    <div className="editor">
      <header
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          marginBottom: '0.2em',
          paddingBottom: '0.2em',
          borderBottom: '1px solid rgba(0,0,0,0.1)',
        }}
      >
        {entry && !canEdit ? (
          <h4>x
            {entry.title}
            <EditIcon
              href="#edit"
              onClick={(e) => {
                e.preventDefault();
                if (entry != null) {
                  dispatch(setCanEdit(true));
                }
              }}
              style={{ marginLeft: '0.4em', cursor:'pointer' }}
            />
          </h4>
        ) : (
          <TextField 
            id="outlined-basic" 
            label="Title" 
            variant="outlined" 
            value={editedEntry?.title ?? ''}
            disabled={!canEdit}
            style={{width:'100%'}}
            onChange={(e) => {
                if (editedEntry) {
                  updateEditedEntry({
                    ...editedEntry,
                    title: e.target.value,
                  });
                } else {
                  updateEditedEntry({
                    title: e.target.value,
                    content: '',
                  });
                }
              }}
            />
        )}
      </header>
      {entry && !canEdit ? (
        <Markdown>{entry.content}</Markdown>
      ) : (
        <>
           <TextField 
            id="outlined-basic" 
            label="Supports Markdown !" 
            variant="outlined" 
            disabled={!canEdit}
            style={{width:'100%'}}
            onChange={(e) => {
              if (editedEntry) {
                updateEditedEntry({
                  ...editedEntry,
                  content: e.target.value,
                });
              } else {
                updateEditedEntry({
                  title: '',
                  content: e.target.value,
                });
              }
            }}
          />
          <ColorButton onClick={saveEntry} disabled={!canEdit} style={{marginTop: '10px'}}>
            Save
          </ColorButton>
        </>
      )}
    </div>
  );
};

export default Editor;
