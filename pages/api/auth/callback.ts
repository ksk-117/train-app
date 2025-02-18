// /api/auth/callback.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../utils/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // 以下は OAuth プロバイダから返ってくるクエリパラメータの例です。
    // codeやstateなどを取得して、SupabaseのAuth APIでログイン処理をするイメージです。
    const { query } = req;
    // 例: ?provider=google&access_token=xxxx&refresh_token=yyyy など

    // ここで必要に応じて情報をデバッグ出力
    console.log('OAuth Callback Query:', query);

    // コールバック処理が終わったら、アプリ内の特定URLへリダイレクトさせる
    // 例: ログイン処理完了後 /view-records に飛ばす
    return res.redirect(302, '/view-records');
  } catch (error: any) {
    console.error('OAuth Callback Error:', error);
    // エラー時はログイン画面などへリダイレクト
    return res.redirect(302, '/login');
  }
}
