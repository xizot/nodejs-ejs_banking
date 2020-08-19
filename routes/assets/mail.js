const MailStructure = {
  getStructure: (title, content) => {
    return `<h3 style="color:#333; text-transform:uppercase; text-align:center; font-size:30px; font-family:Tahoma,Arial,Helvetica,sans-serif">${title}<h3>
        <div style="padding:20px;background-color:#f1f5f6; border-radius:10px;margin:30px;font-family:Tahoma,Arial,Helvetica,sans-serif; font-size:14px;color:#333;min-height:250px">
            <h3 style="font-size:18px; font-weight:bold;text-align:center;color:#333">${content}</h3>
          <p style="margin:20px 0 0">Cảm ơn bạn đã tin tưởng,</p>
          <p style="font-size:18px; margin-top:5px">Pa<span style="color:#29ad57; font-weight:bold">yy</span>ed.</p>
        </div>`;
  },
};

export default MailStructure;
