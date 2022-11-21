pdfjsLib.GlobalWorkerOptions.workerSrc = './lib/pdf.worker.js';
var url = 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/examples/learning/helloworld.pdf';
document.querySelector('#pdf-upload').addEventListener('change', function (e) {
  // document.querySelector('#pages').innerHTML = '';
  zoomReset();
  var file = e.target.files[0];
  if (file.type != 'application/pdf') {
    alert(file.name + ' is not a pdf file.');
    return;
  }

  // var fileReader = new FileReader();
  var loadingTask = pdfjsLib.getDocument(url);

  loadingTask.promise.then(function(pdf) {
    console.log('PDF loaded');
    
    // Fetch the first page
    var pageNumber = 1;
    pdf.getPage(pageNumber).then(function(page) {
      console.log('Page loaded');
      
      var scale = 1.5;
      var viewport = page.getViewport({scale: scale});
  
      // Prepare canvas using PDF page dimensions
      var canvas = document.getElementById('the-canvas');
      var context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;
  
      // Render PDF page into canvas context
      var renderContext = {
        canvasContext: context,
        viewport: viewport
      };
      var renderTask = page.render(renderContext);
      renderTask.promise.then(function () {
        console.log('Page rendered');
      });
    });
  }, function (reason) {
    // PDF loading error
    console.error(reason);
  });


  // fileReader.onload = function () {
  //   var typedarray = new Uint8Array(this.result);

  //   pdfjsLib.getDocument(typedarray).promise.then(function (pdf) {
  //     // you can now use *pdf* here
  //     console.log('the pdf has', pdf.numPages, 'page(s).');
  //     for (var i = 0; i < pdf.numPages; i++) {
  //       (function (pageNum) {
  //         pdf.getPage(i + 1).then(function (page) {
  //           // you can now use *page* here
  //           var viewport = page.getViewport(2.0);
  //           var pageNumDiv = document.createElement('div');
  //           pageNumDiv.className = 'pageNumber';
  //           pageNumDiv.innerHTML = 'Page ' + pageNum;
  //           var canvas = document.createElement('canvas');
  //           canvas.className = 'page';
  //           canvas.title = 'Page ' + pageNum;
  //           document.querySelector('#pages').appendChild(pageNumDiv);
  //           document.querySelector('#pages').appendChild(canvas);
  //           canvas.height = viewport.height;
  //           canvas.width = viewport.width;

  //           page
  //             .render({
  //               canvasContext: canvas.getContext('2d'),
  //               viewport: viewport,
  //             })
  //             .promise.then(function () {
  //               console.log('Page rendered');
  //             });
  //           page.getTextContent().then(function (text) {
  //             console.log(text);
  //           });
  //         });
  //       })(i + 1);
  //     }
  //   });
  // };

  // fileReader.readAsArrayBuffer(file);
});

var curWidth = 60;
function zoomIn() {
  if (curWidth < 150) {
    curWidth += 10;
    document.querySelector('#zoom-percent').innerHTML = curWidth;
    document.querySelectorAll('.page').forEach(function (page) {
      page.style.width = curWidth + '%';
    });
  }
}
function zoomOut() {
  if (curWidth > 20) {
    curWidth -= 10;
    document.querySelector('#zoom-percent').innerHTML = curWidth;
    document.querySelectorAll('.page').forEach(function (page) {
      page.style.width = curWidth + '%';
    });
  }
}
function zoomReset() {
  curWidth = 60;
  document.querySelector('#zoom-percent').innerHTML = curWidth;
  document.querySelectorAll('.page').forEach(function (page) {
    page.style.width = curWidth + '%';
  });
}
document.querySelector('#zoom-in').onclick = zoomIn;
document.querySelector('#zoom-out').onclick = zoomOut;
document.querySelector('#zoom-reset').onclick = zoomReset;
window.onkeypress = function (e) {
  if (e.code == 'Equal') {
    zoomIn();
  }
  if (e.code == 'Minus') {
    zoomOut();
  }
};
