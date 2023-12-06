-- table for storing published versions of each document
create table document_versions
(
    document_version_id uuid         not null default uuid_generate_v4(),
    document_id         uuid         not null,
    version_number      integer      not null default 1,
    title               varchar(255) not null,
    content             text         not null,
    created_at          timestamp    not null default current_timestamp,
    user_id             integer      not null,

    constraint document_versions_pkey primary key (document_version_id),
    constraint document_versions_document_id_version_number_key unique (document_id, version_number),
    constraint document_versions_document_id_fkey foreign key (document_id) references documents (document_id) on delete cascade on update cascade
);
