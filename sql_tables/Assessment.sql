CREATE TABLE IF NOT EXISTS public."Assessments"
(
    "Differential" character varying COLLATE pg_catalog."default",
    visit_id integer,
    health_issue character varying(255) COLLATE pg_catalog."default",
    CONSTRAINT visit_id FOREIGN KEY (visit_id)
        REFERENCES public.visit (visit_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
)