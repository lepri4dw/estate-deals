export const EMAIL_VERIFICATION = (token: string, name: string) => {
  return `<div style="height:100%;width:100%;font-size:14px;font-weight:400;line-height:20px;text-transform:initial;letter-spacing:initial;color:#202223;font-family:-apple-system,BlinkMacSystemFont,San Francisco,Segoe UI,Roboto,Helvetica Neue,sans-serif;margin:0;padding:0">
      <table style="width:100%;border-collapse:collapse;border-spacing:0;margin-top:0;margin-bottom:0;padding:0"><tbody><tr style="margin-top:0;margin-bottom:0;padding:0">
        <td style="margin-top:0;margin-bottom:0;padding:0;border-width:0"></td>
        <td style="margin-top:0;margin-bottom:0;width:470px;padding:0;border-width:0"><table style="width:100%;border-collapse:initial;border-spacing:0;max-width:470px;text-align:left;border-radius:8px;overflow:hidden;margin:32px auto 0;padding:0;border:1px solid #c9cccf"><tbody><tr style="margin-top:0;margin-bottom:0;padding:0"><td style="margin-top:0;margin-bottom:0;padding:0;border-width:0"><table class="m_67968070139110097mail-sections" style="width:100%;border-collapse:collapse;border-spacing:0;margin-top:0;margin-bottom:0;padding:0"><tbody><tr style="margin-top:0;margin-bottom:0;padding:0"><td style="margin-top:0;margin-bottom:0;padding:20px;border-width:0">
          <table style="width:100%;border-collapse:collapse;border-spacing:0;margin-top:0;margin-bottom:0;padding:0"><tbody><tr style="margin-top:0;margin-bottom:0;padding:0"><td style="margin-top:0;margin-bottom:0;padding:0 0 20px;border-width:0"><table style="width:100%;border-collapse:collapse;border-spacing:0;margin-top:0;margin-bottom:0;padding:0"><tbody>
          <tr style="margin-top:0;margin-bottom:0;padding:0"><td style="margin-top:0;margin-bottom:0;padding:0;border-width:0"><h1 style="margin-top:0;margin-bottom:0;font-size:16px;font-weight:600;line-height:24px;text-transform:initial;letter-spacing:initial;padding:0">
            Здравствуйте, ${name}
          </h1></td></tr>
          <tr style="margin-top:0;margin-bottom:0;padding:0"><td style="margin-top:0;margin-bottom:0;padding:16px 0 0;border-width:0"><h2 style="margin-top:0;margin-bottom:0;font-size:15px;font-weight:400;line-height:20px;text-transform:initial;letter-spacing:initial;padding:0">
            Вы зарегистрировали аккаунт на Estate Deals. Прежде чем начать пользоваться своей учетной записью, Вам необходимо подтвердить, что это Ваш адрес электронной почты, нажав на кнопку:
          </h2></td></tr>
          <tr style="margin-top:0;margin-bottom:0;padding:0"><td style="margin-top:0;margin-bottom:0;padding:16px 0 0;border-width:0"><a rel="noopener noreferrer" href="${process.env.APP_URL}/verify-email/${token}" style="margin-top:0;margin-bottom:0;color:white;text-decoration:none;display:inline-block;font-size:16px;font-weight:400;line-height:24px;text-transform:initial;letter-spacing:initial;background-color:#008060;border-radius:4px;padding:0;border-color:#008060;border-style:solid;border-width:10px 20px" target="_blank">Подтвердить email</a></td></tr>
          <tr style="margin-top:0;margin-bottom:0;padding:0"><td style="margin-top:0;margin-bottom:0;padding:16px 0 0;border-width:0"><h2 style="margin-top:0;margin-bottom:0;font-size:15px;font-weight:400;line-height:20px;text-transform:initial;letter-spacing:initial;padding:0">
            Если вы не отправляли запрос на изменение электронной почты, то проигнорируйте это сообщение.
          </h2></td></tr>
          </tbody></table></td></tr></tbody></table>
        </td></tr></tbody></table></td></tr></tbody></table></td>
        <td style="margin-top:0;margin-bottom:0;padding:0;border-width:0"></td>
      </tr>
        </tbody>
      </table>
    </div>`;
};