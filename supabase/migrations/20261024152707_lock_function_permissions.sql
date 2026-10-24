-- ---------------------------------------------------------------------
-- 13. FONKSİYON İZİNLERİ (Supabase güvenlik denetimi sonrası)
-- Supabase, public şemadaki fonksiyonlara varsayılan olarak anonim
-- çalıştırma izni verir. İş fonksiyonları sadece giriş yapmış kullanıcıya,
-- iç fonksiyonlar hiç kimseye açık değildir.
-- ---------------------------------------------------------------------
revoke execute on function book_lesson(uuid, timestamptz, int) from public, anon;
revoke execute on function cancel_lesson(uuid)                 from public, anon;
revoke execute on function calc_refund(uuid)                   from public, anon;

revoke execute on function current_fee(uuid, timestamptz)  from public, anon, authenticated;
revoke execute on function trg_lesson_payout()             from public, anon, authenticated;
revoke execute on function trg_validate_payment()          from public, anon, authenticated;
revoke execute on function payout_period(timestamptz)      from public, anon, authenticated;

-- is_admin / is_parent_of / teaches_student BİLİNÇLİ OLARAK açık kalır:
-- RLS politikaları bunları çağırır; anonim kullanıcıda auth.uid() boş olduğu için hep false döner.
