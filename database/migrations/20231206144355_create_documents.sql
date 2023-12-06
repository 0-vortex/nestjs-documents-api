-- table for storing initial document identification and creation information
create table documents
(
    document_id    uuid      not null default uuid_generate_v4(),
    version_number integer   not null default 1,
    user_id        integer   not null,
    created_at     timestamp not null default current_timestamp,
    is_deleted     boolean   not null default false,

    constraint documents_pkey primary key (document_id)
);
