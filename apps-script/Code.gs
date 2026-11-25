/**
 * Here by Grace 네컷 — 사진 업로드 & 다운로드 페이지 (Google Apps Script)
 *
 * 1) 구글 드라이브에 사진을 모을 폴더를 만들고, 주소창의 폴더 ID를 아래 FOLDER_ID에 넣습니다.
 *    예: https://drive.google.com/drive/folders/1AbCdEf...  →  "1AbCdEf..."
 * 2) 배포 → 새 배포 → 유형 "웹 앱", 실행 사용자 "나", 액세스 권한 "모든 사용자".
 * 3) 나온 웹 앱 URL(…/exec)을 photobooth/config.js 의 uploadUrl 에 넣습니다.
 */
const FOLDER_ID = "여기에_폴더_ID";
const TITLE = "Here by Grace";

// 촬영 기기 → 사진 업로드. { name, data(base64 jpeg) } 를 받아 저장하고 다운로드 페이지 주소를 돌려줍니다.
function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    const name = String(body.name || "photo.jpg").replace(/[^\w.\-]/g, "_");
    const blob = Utilities.newBlob(Utilities.base64Decode(body.data), "image/jpeg", name);
    const file = DriveApp.getFolderById(FOLDER_ID).createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    const page = ScriptApp.getService().getUrl() + "?id=" + file.getId();
    return json({ ok: true, id: file.getId(), page: page });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

// QR을 찍은 휴대폰 → 사진 한 장만 보여 주는 다운로드 페이지.
function doGet(e) {
  const id = e && e.parameter && e.parameter.id;
  if (!id) return HtmlService.createHtmlOutput("<p style='font-family:sans-serif'>사진 주소가 올바르지 않아요.</p>");
  let file;
  try {
    file = DriveApp.getFileById(id);
    if (file.getParents().next().getId() !== FOLDER_ID) throw new Error("folder");
  } catch (err) {
    return HtmlService.createHtmlOutput("<p style='font-family:sans-serif'>사진을 찾을 수 없어요.</p>");
  }
  const dataUrl = "data:image/jpeg;base64," + Utilities.base64Encode(file.getBlob().getBytes());
  const download = "https://drive.google.com/uc?export=download&id=" + id;
  const html =
    "" +
    "<div style='font-family:-apple-system,\"Apple SD Gothic Neo\",sans-serif;max-width:480px;margin:0 auto;padding:20px;text-align:center;color:#1d2030'>" +
    "<h2 style='margin:8px 0 4px'>" + TITLE + "</h2>" +
    "<p style='color:#6b7083;margin:0 0 16px'>사진을 길게 눌러 저장하거나, 아래 버튼을 눌러 주세요.</p>" +
    "<img src='" + dataUrl + "' style='width:70%;border-radius:8px;box-shadow:0 4px 18px rgba(0,0,0,.15)'>" +
    "<p><a href='" + download + "' target='_top' style='display:inline-block;margin-top:16px;padding:14px 28px;background:#3949ab;color:#fff;border-radius:12px;text-decoration:none;font-size:17px'>사진 다운로드</a></p>" +
    "</div>";
  return HtmlService.createHtmlOutput(html)
    .setTitle(TITLE)
    .addMetaTag("viewport", "width=device-width, initial-scale=1");
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
