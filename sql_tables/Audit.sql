CREATE TABLE IF NOT EXISTS public.audit
(
    username character varying(20) COLLATE pg_catalog."default" NOT NULL,
    action character varying(20) COLLATE pg_catalog."default" NOT NULL,
    patient_id integer,
    visit_id integer,
    change_made character varying(55) COLLATE pg_catalog."default"
)


CREATE INDEX IF NOT EXISTS fki_audit_patient_id
    ON public.audit USING btree
    (patient_id ASC NULLS LAST)
    TABLESPACE pg_default;
-- Index: fki_v

-- DROP INDEX IF EXISTS public.fki_v;

CREATE INDEX IF NOT EXISTS fki_v
    ON public.audit USING btree
    (visit_id ASC NULLS LAST)
    TABLESPACE pg_default;