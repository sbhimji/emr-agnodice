CREATE TABLE IF NOT EXISTS public.visit
(
    patient_id integer,
    visit_id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 10000 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    visit_date character varying(25) COLLATE pg_catalog."default",
    attending_physician character varying COLLATE pg_catalog."default",
    volunteers character varying[] COLLATE pg_catalog."default",
    event_name character varying(25) COLLATE pg_catalog."default",
    ros_general character varying(255) COLLATE pg_catalog."default",
    ros_cardio character varying(255) COLLATE pg_catalog."default",
    ros_resp character varying(255) COLLATE pg_catalog."default",
    ros_skin character varying(255) COLLATE pg_catalog."default",
    ros_heent character varying(255) COLLATE pg_catalog."default",
    ros_gi character varying(255) COLLATE pg_catalog."default",
    ros_gu character varying(255) COLLATE pg_catalog."default",
    ros_mus character varying(255) COLLATE pg_catalog."default",
    ros_endo character varying(255) COLLATE pg_catalog."default",
    phys_gen_norm character varying(255) COLLATE pg_catalog."default",
    phys_gen_ab character varying(255) COLLATE pg_catalog."default",
    phys_heart_norm character varying(255) COLLATE pg_catalog."default",
    phys_heart_ab character varying(255) COLLATE pg_catalog."default",
    phys_lungs_norm character varying(255) COLLATE pg_catalog."default",
    phys_lungs_ab character varying(255) COLLATE pg_catalog."default",
    phys_skin_norm character varying(255) COLLATE pg_catalog."default",
    phys_skin_ab character varying(255) COLLATE pg_catalog."default",
    phys_heent_norm character varying(255) COLLATE pg_catalog."default",
    phys_heent_ab character varying(255) COLLATE pg_catalog."default",
    phys_abdo_norm character varying(255) COLLATE pg_catalog."default",
    phys_abdo_ab character varying(255) COLLATE pg_catalog."default",
    phys_mus_norm character varying(255) COLLATE pg_catalog."default",
    phys_mus_ab character varying(255) COLLATE pg_catalog."default",
    phys_neuro_norm character varying(255) COLLATE pg_catalog."default",
    phys_neuro_ab character varying(255) COLLATE pg_catalog."default",
    phys_omm_norm character varying(255) COLLATE pg_catalog."default",
    phys_omm_ab character varying(255) COLLATE pg_catalog."default",
    phys_other_norm character varying(255) COLLATE pg_catalog."default",
    phys_other_ab character varying(255) COLLATE pg_catalog."default",
    hpi character varying(2000) COLLATE pg_catalog."default",
    phys_thoughts character varying(2000) COLLATE pg_catalog."default",
    phys_name character varying(25) COLLATE pg_catalog."default",
    refferals character varying(255) COLLATE pg_catalog."default",
    patient_agreement character varying(10) COLLATE pg_catalog."default",
    med_presc character varying(255) COLLATE pg_catalog."default",
    pulse_bpm integer,
    blood_pressure character varying(7) COLLATE pg_catalog."default",
    temperature numeric,
    resp_rate integer,
    height character varying(15) COLLATE pg_catalog."default",
    weight numeric,
    blood_sugar character varying(15) COLLATE pg_catalog."default",
    hours_last_meal character varying(3) COLLATE pg_catalog."default",
    fam_mother character varying(40) COLLATE pg_catalog."default",
    fam_father character varying(40) COLLATE pg_catalog."default",
    fam_siblings character varying(40) COLLATE pg_catalog."default",
    fam_children character varying(40) COLLATE pg_catalog."default",
    fam_sig_other character varying(40) COLLATE pg_catalog."default",
    soc_hist_occ character varying(40) COLLATE pg_catalog."default",
    soc_hist_diet character varying(40) COLLATE pg_catalog."default",
    soc_hist_exc character varying(40) COLLATE pg_catalog."default",
    marijuana_use character varying(40) COLLATE pg_catalog."default",
    fun_drugs character varying(40) COLLATE pg_catalog."default",
    desire_to_quit character varying(10) COLLATE pg_catalog."default",
    caffeine_use character varying(25) COLLATE pg_catalog."default",
    alc_use character varying(40) COLLATE pg_catalog."default",
    last_year_part character varying(40) COLLATE pg_catalog."default",
    protection_use character varying(40) COLLATE pg_catalog."default",
    sti character varying(40) COLLATE pg_catalog."default",
    curr_housing character varying(40) COLLATE pg_catalog."default",
    yr3_housing character varying(40) COLLATE pg_catalog."default",
    packs_day integer,
    tobac_yrs integer,
    pack_yrs integer,
    fam_added boolean,
    soc_added boolean,
    sex_act character varying(40) COLLATE pg_catalog."default",
    consent character varying(5) COLLATE pg_catalog."default",
    pets character varying(40) COLLATE pg_catalog."default",
    leukocytes character varying(5) COLLATE pg_catalog."default",
    nitrite character varying(5) COLLATE pg_catalog."default",
    urobilinogen character varying(5) COLLATE pg_catalog."default",
    protein character varying(5) COLLATE pg_catalog."default",
    ph character varying(5) COLLATE pg_catalog."default",
    blood character varying(5) COLLATE pg_catalog."default",
    specific_gravity character varying(5) COLLATE pg_catalog."default",
    ketone character varying(5) COLLATE pg_catalog."default",
    bilirubin character varying(5) COLLATE pg_catalog."default",
    glucose character varying(5) COLLATE pg_catalog."default",
    CONSTRAINT visit_pkey PRIMARY KEY (visit_id),
    CONSTRAINT patient_id FOREIGN KEY (patient_id)
        REFERENCES public."patientGenInfo" (patient_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
)