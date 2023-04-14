import { addIcon } from '@osuresearch/iconography';
import tableOfContents from '@iconify/icons-mdi/book-open-outline';
import comment from '@iconify/icons-mdi/comment-outline';
import multipleComments from '@iconify/icons-mdi/comment-multiple-outline';
import addComment from '@iconify/icons-mdi/comment-plus-outline';
import questioningComment from '@iconify/icons-mdi/comment-question-outline';
import suggestionComment from '@iconify/icons-mdi/comment-edit-outline';
import resolvedComment from '@iconify/icons-mdi/comment-check-outline';
import alertComment from '@iconify/icons-mdi/comment-alert-outline';

const icons: Record<string, any> = {
  tableOfContents,
  comment,
  multipleComments,
  addComment,
  questioningComment,
  suggestionComment,
  resolvedComment,
  alertComment,
}

export function loadAllIcons() {
  Object.keys(icons).forEach((name) => {
    addIcon(name, icons[name]);
  });
}
