<?php
class I18n {
	public $locale_code = "en",
		   $section = "string";
	public $i_text;

	public function set_locale($locale_code ="en",$section ="string") {
		$file_name = "../i18n/$locale_code/$section.json";
		if (!file_exists($file_name)) {
			$section = "string";
			$locale_code = "en";
			$file_name = "../i18n/$locale_code/$section.json";
		}
		if (file_exists($file_name)) {
			$this->locale_code = $locale_code;
			$this->section = $section;			
			$this->i_JSON_load($file_name);
		}
	}

	// load from JSON
	public function i_JSON_load($file_name) {
		$tmp = file_get_contents($file_name);
		$this->i_text[$this->locale_code] = json_decode($tmp,true);
	}

	public function i_translate($code,$args) {
		if (isset($this->i_text[$this->locale_code][$code])) {
			$code = $this->i_text[$this->locale_code][$code];
		}
		return vsprintf($code, $args);
	}
}

if (!function_exists("L")) {
	function L() {
		global $i18n;
		$args = func_get_args();
		$code = $args[0];
		array_shift($args);

		return $i18n->i_translate($code,$args);
	}
}
$i18n = new I18n();

// ============================
// $i18n->set_locale("th");
// echo L("Hello World");
// echo "<br>",L("My name is %s and I am %d years old.","chanwit","43");
// $i18n->set_locale("en");
// echo "<hr>";
// echo L("Hello World");
// echo "<br>",L("My name is %s and I am %d years old.","chanwit","43");

?>