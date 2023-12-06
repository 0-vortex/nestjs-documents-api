-- table for storing initial document identification and creation information
create table documents
(
    document_id    uuid      not null default uuid_generate_v4(),
    version_number integer   not null default 1,
    user_id        integer   not null,
    created_at     timestamp not null default current_timestamp,
    deleted_at     timestamp default null,

    constraint documents_pkey primary key (document_id)
);
