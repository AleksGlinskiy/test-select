document.addEventListener("DOMContentLoaded", function(){
    new MySelect('.select', {
        data: [ 
            { "label": "Bawcomville", "id": 0 },
            { "label": "Rushford", "id": 1 },
            { "label": "Bayview", "id": 2 },
            { "label": "Minsk", "id": 3 },
            { "label": "Vitebsk", "id": 4 },
            { "label": "Brest", "id": 5 }
        ],
    });
});