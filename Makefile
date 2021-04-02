.DEFAULT_GOAL := all

APP_NAME = crowd_helper
CHROME = google-chrome

SRC = src
DOWNLOAD = download
TARGET = target
PACKAGES = packages
TARGET_APP_DIR_NAME = atlassian-crowd-helper-browser-extension

CHROME_TARGET = $(TARGET)/$(CHROME)/$(TARGET_APP_DIR_NAME)

CHROME_APP_VERSION = $(shell cat $(SRC)/$(CHROME)/manifest.json | grep version | head -1 | cut -d'"' -f 4 )

JQUERY_URL="https://code.jquery.com/jquery-3.5.1.slim.min.js"
JQUERY_LICENSE_URL="https://jquery.org/license/"

BOOTSTRAP_ZIP_URL="https://github.com/twbs/bootstrap/releases/download/v4.6.0/bootstrap-4.6.0-dist.zip"
BOOTSTRAP_LICENSE_URL="https://raw.githubusercontent.com/twbs/bootstrap/v4.0.0/LICENSE"
BOOTSTRAP_ZIP = $(DOWNLOAD)/bootstrap.zip

CLIPART_REPO_URL="https://github.com/bivanbi/atlassian-tools-clipart.git"
CLIPART_REPO = $(DOWNLOAD)/clipart
CLIPART_VERSION = v2.0.0

JQUERY_URL="https://code.jquery.com/jquery-3.5.1.slim.min.js"

VENDOR_DIR = vendor
JQUERY_DIR = $(VENDOR_DIR)/jquery
JQUERY_JS = jquery.slim.min.js

BOOTSTRAP_DIR = $(VENDOR_DIR)/bootstrap
BOOTSTRAP_CSS = bootstrap.min.css
BOOTSTRAP_JS = bootstrap.bundle.min.js

IMAGE_DIR = images
FAVICON = favicon.ico

all: $(CHROME)


.PHONY: $(CHROME)
$(CHROME): $(CHROME_TARGET) \
			$(CHROME_TARGET)/$(JQUERY_DIR)/LICENSE \
			$(CHROME_TARGET)/$(JQUERY_DIR)/$(JQUERY_JS) \
			$(CHROME_TARGET)/$(BOOTSTRAP_DIR)/LICENSE \
			$(CHROME_TARGET)/$(BOOTSTRAP_DIR)/$(BOOTSTRAP_CSS) \
			$(CHROME_TARGET)/$(BOOTSTRAP_DIR)/$(BOOTSTRAP_JS) \
			$(CHROME_TARGET)/$(IMAGE_DIR) \
			$(CHROME_TARGET)/README.md \
			$(CHROME_TARGET)/LICENSE.md  \
			$(CHROME_TARGET)/documentation  \
			$(PACKAGES)/$(CHROME)/$(TARGET_APP_DIR_NAME)-v$(CHROME_APP_VERSION).zip

$(BOOTSTRAP_ZIP):
	mkdir -p $(DOWNLOAD)
	curl -sfL "$(BOOTSTRAP_ZIP_URL)" -o $(BOOTSTRAP_ZIP)

$(CLIPART_REPO):
	mkdir -p $(DOWNLOAD)
	git clone "$(CLIPART_REPO_URL)" $(CLIPART_REPO)
	git -C $(CLIPART_REPO) checkout $(CLIPART_VERSION)

$(CHROME_TARGET):
	mkdir -p $(CHROME_TARGET)
	(cd $(SRC)/$(CHROME) ; tar cf - --exclude="images" --exclude="vendor" --exclude=".gitignore" . ) | (cd $(CHROME_TARGET) ; tar xfBp -)

%/$(JQUERY_JS):
	mkdir -p "$$(dirname $@)"
	curl -sf "$(JQUERY_URL)" -o $@

%/$(BOOTSTRAP_CSS): $(BOOTSTRAP_ZIP)
	unzip -u $(BOOTSTRAP_ZIP) -d $(DOWNLOAD)/
	mkdir -p "$$(dirname $@)"
	cp $(DOWNLOAD)/bootstrap*dist/css/bootstrap.min.css "$@"

%/$(BOOTSTRAP_JS): $(BOOTSTRAP_ZIP)
	unzip -u $(BOOTSTRAP_ZIP) -d $(DOWNLOAD)/
	mkdir -p "$$(dirname $@)"
	cp $(DOWNLOAD)/bootstrap*dist/js/bootstrap.bundle.min.js "$@"

%/$(BOOTSTRAP_DIR)/LICENSE:
	mkdir -p "$$(dirname $@)"
	curl -sf "$(BOOTSTRAP_LICENSE_URL)" -o $@

%/$(JQUERY_DIR)/LICENSE:
	mkdir -p "$$(dirname $@)"
	echo "JQuery is licensed under MIT license. See $(JQUERY_LICENSE_URL) for details." > $@

$(CHROME_TARGET)/$(IMAGE_DIR): $(CLIPART_REPO)
	$(DOWNLOAD)/clipart/build_images.sh
	mkdir -p $(CHROME_TARGET)/$(IMAGE_DIR)
	cp --no-preserve timestamps $(DOWNLOAD)/clipart/target/$(APP_NAME)/$(APP_NAME)-favicon.svg $(CHROME_TARGET)/$(IMAGE_DIR)/$(APP_NAME)-favicon.svg
	cp --no-preserve timestamps $(DOWNLOAD)/clipart/target/$(APP_NAME)/$(APP_NAME)[0-9]*.png $(CHROME_TARGET)/$(IMAGE_DIR)/

$(PACKAGES)/$(CHROME)/$(TARGET_APP_DIR_NAME)-v%.zip:
	mkdir -p $(PACKAGES)/$(CHROME)
	cd $(TARGET)/$(CHROME) && zip -r $(TARGET_APP_DIR_NAME).zip $(TARGET_APP_DIR_NAME)
	mv $(TARGET)/$(CHROME)/$(TARGET_APP_DIR_NAME).zip $@

$(CHROME_TARGET)/LICENSE.md:
	cp --no-preserve timestamps LICENSE.md $@

$(CHROME_TARGET)/README.md:
	cp --no-preserve timestamps README.md $@

$(CHROME_TARGET)/documentation:
	cp -R --no-preserve timestamps documentation $@

clean:
	rm -rf $(TARGET) $(DOWNLOAD)
