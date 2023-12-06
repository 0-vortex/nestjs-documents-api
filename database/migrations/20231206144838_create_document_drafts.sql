-- table for storing edit drafts of each document
create table document_drafts
(
    document_draft_id   uuid         not null default uuid_generate_v4(),
    document_id         uuid         not null,
    document_version_id uuid         not null,
    title               varchar(255) not null,
    content             text         not null,
    created_at          timestamp    not null default current_timestamp,
    user_id             integer      not null,

    constraint document_drafts_pkey primary key (document_draft_id),
    constraint document_drafts_document_id_fkey foreign key (document_id) references documents (document_id) on delete cascade on update cascade,
    constraint document_drafts_document_version_id_fkey foreign key (document_version_id) references document_versions (document_version_id) on delete cascade on update cascade
);
