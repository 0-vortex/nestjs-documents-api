-- insert first documents
insert into documents (user_id, deleted_at)
values (1, NULL), (2, NULL), (1, CURRENT_TIMESTAMP);
insert into document_versions (document_id, user_id, title, content)
values ('2b012d78-3868-4cf2-b4a3-b354fabc7085', 1, 'test title 1', 'test content 1'),
       ('54cf55b3-231f-4cc6-9e5f-b8afba9deff5', 2, 'test title 2', 'test content 2'),
       ('1f74dbd9-15cc-4615-95e4-af403f1c1b50', 1, 'test deleted article', 'test deleted content');

-- insert first document edits
insert into document_drafts (document_version_id, document_id, user_id, title, content)
values ('bf38a80f-0a42-44e8-9c82-fed6b4c56a6a', '2b012d78-3868-4cf2-b4a3-b354fabc7085', '2', 'test edit title 1', 'test edit content 1');
-- publish first version edits
insert into document_versions (document_id, user_id, version_number, title, content)
values ('2b012d78-3868-4cf2-b4a3-b354fabc7085', '2', 2, 'test edit title 1', 'test edit content 1');
update documents set version_number = 2 where document_id = '2b012d78-3868-4cf2-b4a3-b354fabc7085';

-- insert first document unpublished edits
insert into document_drafts (document_version_id, document_id, user_id, title, content)
values ('bf38a80f-0a42-44e8-9c82-fed6b4c56a6a', '2b012d78-3868-4cf2-b4a3-b354fabc7085', '1', 'test unpublished title 1', 'test unpublished content 1');
