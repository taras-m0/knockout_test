import * as ko from "knockout";

ko.bindingHandlers.slideVisible = {
  update: function(element, valueAccessor, allBindings) {
    // Сначала получаем последние данные, к которым мы привязаны
    const value = valueAccessor();

    // Затем, независимо от того, является ли предоставленное свойство модели наблюдаемым, получаем его текущее значение
    const valueUnwrapped = ko.unwrap(value);

    // Захватываем еще данные из другого свойства привязки
    const duration = allBindings.get('slideDuration') || 400; // 400 мс - продолжительность по умолчанию, если не указано иное

    // Теперь манипулируем элементом DOM
    if (valueUnwrapped == true)
      $(element).slideDown(duration); // Делаем элемент видимым
    else
      $(element).slideUp(duration);   // Делаем элемент невидимым
  }
};
