CREATE TABLE IF NOT EXISTS public."med-hist"
(
    patient_id integer,
    condition_ character varying(50) COLLATE pg_catalog."default",
    yr_occured integer,
    medications character varying(60) COLLATE pg_catalog."default",
    dose_and_freq character varying(50) COLLATE pg_catalog."default",
    hosp character varying(250) COLLATE pg_catalog."default",
    CONSTRAINT pat_id_med_hist FOREIGN KEY (patient_id)
        REFERENCES public."patientGenInfo" (patient_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
)
